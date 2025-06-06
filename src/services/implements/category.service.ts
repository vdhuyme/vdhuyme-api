import { BASE_STATUS } from '@constants/base.status'
import { TYPES } from '@constants/types'
import { Category } from '@entities/category'
import { Post } from '@entities/post'
import BadRequestException from '@exceptions/bad.request.exception'
import { IPaginationResult, IQueryOptions } from '@repositories/contracts/base.repository.interface'
import { ICategoryRepository } from '@repositories/contracts/category.repository.interface'
import { IPostRepository } from '@repositories/contracts/post.repository.interface'
import { ICategoryService } from '@services/contracts/category.service.interface'
import BaseService from '@services/implements/base.service'
import { inject, injectable } from 'inversify'
import { Brackets, DeepPartial, FindOptionsWhere, ILike } from 'typeorm'

@injectable()
export default class CategoryService extends BaseService<Category> implements ICategoryService {
  private readonly categoryRepository: ICategoryRepository
  private readonly postRepository: IPostRepository

  constructor(
    @inject(TYPES.CategoryRepository) categoryRepository: ICategoryRepository,
    @inject(TYPES.PostRepository) postRepository: IPostRepository
  ) {
    super(categoryRepository)
    this.postRepository = postRepository
  }

  paginate(options: IQueryOptions<Category>): Promise<IPaginationResult<Category>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', orderBy = 'DESC' } = options

    const allowedSortFields: (keyof Category)[] = ['id', 'name', 'status', 'createdAt', 'updatedAt']
    const sortField = allowedSortFields.includes(sortBy as keyof Category) ? sortBy : 'createdAt'

    const findOptions: IQueryOptions<Category> = {
      page,
      limit,
      sortBy: sortField as keyof Category,
      orderBy,
      where: search ? { name: ILike(`%${search}%`) } : undefined
    }

    return super.paginate(findOptions)
  }

  async getTrees(): Promise<Category[]> {
    return this.categoryRepository.findTrees()
  }

  async getPublishedCategories(
    options: IQueryOptions<Category>
  ): Promise<IPaginationResult<Category>> {
    const { limit = 10, page = 1, search, sortBy = 'createdAt', orderBy = 'DESC' } = options

    const allowedSortFields: (keyof Category)[] = ['id', 'name', 'createdAt', 'updatedAt', 'status']
    const sortField = allowedSortFields.includes(sortBy as keyof Category) ? sortBy : 'createdAt'

    const where: FindOptionsWhere<Category> = {
      status: BASE_STATUS.PUBLISHED
    }

    if (search) {
      where.name = ILike(`%${search}%`)
    }

    const findOptions: IQueryOptions<Category> = {
      where,
      sortBy: sortField as keyof Category,
      orderBy,
      page,
      limit
    }

    return super.paginate(findOptions)
  }

  async getPublishedCategory(
    id: string | number,
    options?: IQueryOptions<Category>
  ): Promise<Category> {
    const { search, sortBy = 'createdAt', orderBy = 'DESC', page = 1, limit = 50 } = options || {}
    const allowedSortFields: (keyof Post)[] = ['id', 'title', 'createdAt', 'status']
    const sortField = allowedSortFields.includes(sortBy as keyof Post) ? sortBy : 'createdAt'

    const category = await this.findByIdOrFail(id)

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.category', 'category')
      .where('category.id = :categoryId', { categoryId: category.id })
      .andWhere('post.status = :status', { status: BASE_STATUS.PUBLISHED })

    if (search) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where('LOWER(post.title) ILIKE LOWER(:search)', { search: `%${search}%` }).orWhere(
            'LOWER(post.content) ILIKE LOWER(:search)',
            { search: `%${search}%` }
          )
        })
      )
    }

    queryBuilder
      .orderBy(`post.${sortField}`, orderBy.toUpperCase() === 'ASC' ? 'ASC' : 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const posts = await queryBuilder.getMany()
    category.posts = posts

    return category
  }

  async store(parentId: string | number, data: DeepPartial<Category>): Promise<Category> {
    const parent = await this.getParentOrFail(parentId)
    const category = this.create({ ...data, parent })
    return await this.save(category)
  }

  async updateCategory(
    id: string | number,
    parentId: string | number,
    data: DeepPartial<Category>
  ): Promise<Category> {
    const category = await this.findById(id)
    if (!category) {
      throw new BadRequestException(`Not found category ${id}`)
    }

    if (parentId === category.id) {
      throw new BadRequestException(`A category cannot be its own parent`)
    }

    const parent = await this.getParentOrFail(parentId)
    Object.assign(category, data, { parent })

    return await this.save(category)
  }

  private async getParentOrFail(parentId: string | number): Promise<Category | null> {
    if (!parentId) {
      return null
    }

    const parent = await this.categoryRepository.findById(parentId)
    if (!parent) {
      throw new BadRequestException(`Parent category not found ${parentId}`)
    }

    return parent
  }
}
