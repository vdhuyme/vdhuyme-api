import { BASE_STATUS } from '@constants/base.status'
import { TYPES } from '@constants/types'
import { Post } from '@entities/post'
import BadRequestException from '@exceptions/bad.request.exception'
import { IQueryOptions, IPaginationResult } from '@repositories/contracts/base.repository.interface'
import { ICategoryRepository } from '@repositories/contracts/category.repository.interface'
import { IPostRepository } from '@repositories/contracts/post.repository.interface'
import { ITagRepository } from '@repositories/contracts/tag.repository.interface'
import { IUserRepository } from '@repositories/contracts/user.repository.interface'
import { IPostService } from '@services/contracts/post.service.interface'
import BaseService from '@services/implements/base.service'
import { inject, injectable } from 'inversify'
import { DeepPartial, ILike, In, Brackets } from 'typeorm'

@injectable()
export default class PostService extends BaseService<Post> implements IPostService {
  private readonly tagRepository: ITagRepository
  private readonly categoryRepository: ICategoryRepository
  private readonly userRepository: IUserRepository

  constructor(
    @inject(TYPES.PostRepository) postRepository: IPostRepository,
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.TagRepository) tagRepository: ITagRepository,
    @inject(TYPES.CategoryRepository) categoryRepository: ICategoryRepository
  ) {
    super(postRepository)
    this.tagRepository = tagRepository
    this.categoryRepository = categoryRepository
    this.userRepository = userRepository
  }

  async paginate(options: IQueryOptions<Post>): Promise<IPaginationResult<Post>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', orderBy = 'DESC' } = options

    const allowedSortFields: (keyof Post)[] = ['id', 'title', 'createdAt', 'status']
    const sortField = allowedSortFields.includes(sortBy as keyof Post) ? sortBy : 'createdAt'

    const findOptions: IQueryOptions<Post> = {
      page,
      limit,
      sortBy: sortField as keyof Post,
      orderBy,
      where: search ? { title: ILike(`%${search}%`) } : undefined,
      relations: ['category', 'tags', 'author']
    }

    return super.paginate(findOptions)
  }

  async getPublishedPosts(
    options: IQueryOptions<Post> & { categoryId?: number }
  ): Promise<IPaginationResult<Post>> {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      sortBy = 'createdAt',
      orderBy = 'DESC'
    } = options

    const queryBuilder = this.repository
      .createQueryBuilder('post')
      .innerJoin('post.author', 'author')
      .addSelect([
        'author.id',
        'author.name',
        'author.email',
        'author.phoneNumber',
        'author.avatar'
      ])
      .innerJoinAndSelect('post.category', 'category')
      .where('category.status = :status', { status: BASE_STATUS.PUBLISHED })
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

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId })
    }

    const [items, totalItems] = await queryBuilder
      .orderBy(`post.${sortBy}`, orderBy)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
      }
    }
  }

  async getPublishedPost(id: string | number): Promise<Post> {
    const post = await this.repository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect([
        'author.id',
        'author.name',
        'author.email',
        'author.phoneNumber',
        'author.avatar'
      ])
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.id = :postId', { postId: id })
      .andWhere('post.status = :status', { status: BASE_STATUS.PUBLISHED })
      .getOne()

    if (!post) {
      throw new BadRequestException(`Not found post ${id}`)
    }

    return post
  }

  async getRelatedPosts(id: string | number, limit: number): Promise<Post[]> {
    const post = await this.findById(id)
    if (!post) {
      throw new BadRequestException(`Not found post ${id}`)
    }

    return await this.repository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tag')
      .where('post.status = :status', { status: BASE_STATUS.PUBLISHED })
      .andWhere('post.id != :postId', { postId: post.id })
      .groupBy('post.id')
      .addGroupBy('category.id')
      .addGroupBy('tag.id')
      .addSelect(['category.id', 'category.name', 'category.slug'])
      .orderBy('post.createdAt', 'DESC')
      .distinct(true)
      .take(limit)
      .getMany()
  }

  private async getCategoryOrFail(categoryId: string | number) {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) {
      throw new BadRequestException(`Not found category ${categoryId}`)
    }
    return category
  }

  private async getTagsByIds(tagIds: string[] | number[]) {
    const uniqueTagIds = Array.from(new Set((tagIds as (string | number)[]).map(String)))
    return this.tagRepository.findAll({ where: { id: In(uniqueTagIds) } })
  }

  private async getAuthorOrFail(userId: string | number) {
    const author = await this.userRepository.findById(userId)
    if (!author) {
      throw new BadRequestException(`Not found user ${userId}`)
    }
    return author
  }

  async store(
    userId: string | number,
    categoryId: string | number,
    tagIds: string[] | number[],
    data: DeepPartial<Post>
  ): Promise<Post> {
    const [author, category, tags] = await Promise.all([
      this.getAuthorOrFail(userId),
      this.getCategoryOrFail(categoryId),
      this.getTagsByIds(tagIds)
    ])

    const post = this.create({ ...data, author, category, tags })
    return this.save(post)
  }

  async updatePost(
    id: string | number,
    categoryId: string | number,
    tagIds: string[] | number[],
    data: DeepPartial<Post>
  ): Promise<Post> {
    const post = await this.findById(id)
    if (!post) {
      throw new BadRequestException(`Not found post ${id}`)
    }

    const [category, tags] = await Promise.all([
      this.getCategoryOrFail(categoryId),
      this.getTagsByIds(tagIds)
    ])

    Object.assign(post, data, { category, tags })
    return this.save(post)
  }
}
