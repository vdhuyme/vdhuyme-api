import { BASE_STATUS } from '@constants/base.status'
import { TYPES } from '@constants/types'
import { Category } from '@entities/category'
import BadRequestException from '@exceptions/bad.request.exception'
import { IQueryOptions } from '@repositories/contracts/base.repository.interface'
import { ICategoryRepository } from '@repositories/contracts/category.repository.interface'
import { ICategoryService } from '@services/contracts/category.service.interface'
import BaseService from '@services/implements/base.service'
import { inject, injectable } from 'inversify'
import { DeepPartial, FindOptionsWhere, ILike } from 'typeorm'

@injectable()
export default class CategoryService extends BaseService<Category> implements ICategoryService {
  private readonly categoryRepository: ICategoryRepository

  constructor(@inject(TYPES.CategoryRepository) categoryRepository: ICategoryRepository) {
    super(categoryRepository)
    this.categoryRepository = categoryRepository
  }

  async getTrees(): Promise<Category[]> {
    return this.categoryRepository.findTrees()
  }

  async getPublishedCategories(options: IQueryOptions<Category>): Promise<Category[]> {
    const { search, sort } = options

    const where: FindOptionsWhere<Category> = {
      status: BASE_STATUS.PUBLISHED,
      ...(search && { name: ILike(`%${search}%`) })
    }
    const allowedSortFields: (keyof Category)[] = ['id', 'name', 'status', 'updatedAt', 'createdAt']
    const order = this.buildOrder(sort, allowedSortFields)

    return super.findAll({ where, order })
  }

  async getPublishedCategory(
    id: string | number,
    options?: IQueryOptions<Category>
  ): Promise<Category> {
    const { page = 1, limit = 50 } = options || {}

    const query = this.repository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.posts', 'post', 'post.status = :status', { status: 'PUBLISHED' })
      .where('category.id = :id', { id })

    query.skip((page - 1) * limit).take(limit)
    const category = await query.getOne()

    if (!category) {
      throw new BadRequestException(`Not found category ${id}`)
    }

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
