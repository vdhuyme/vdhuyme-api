import { BASE_STATUS } from '@constants/base.status'
import { Post } from '@entities/post'
import { IPostRepository, PostsWithTotal } from '@interfaces/index'
import CreatePostRequest from '@requests/create.post.request'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'
import UpdatePostRequest from '@requests/update.post.request'
import { ds } from 'data-source'
import { injectable } from 'inversify'
import { Repository } from 'typeorm'

@injectable()
export default class PostRepository implements IPostRepository {
  repository: Repository<Post>

  constructor() {
    this.repository = ds.getRepository<Post>(Post)
  }

  async createPost(data: CreatePostRequest): Promise<void> {
    const post = this.repository.create(data)
    await this.repository.save(post)
  }

  async getPost(slug: string): Promise<Post | null> {
    return this.repository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.email'])
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.slug = :slug', { slug })
      .getOne()
  }

  async getPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal> {
    const { page, limit, query, sort, categoryId } = options
    const skip = (page - 1) * limit

    const queryBuilder = this.repository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.email'])
      .leftJoinAndSelect('post.category', 'category')

    if (query) {
      queryBuilder.andWhere('LOWER(post.title) LIKE LOWER(:query)', {
        query: `%${query}%`
      })
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId })
    }

    queryBuilder
      .orderBy('post.createdAt', sort as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit)

    const [posts, total] = await queryBuilder.getManyAndCount()

    return { posts, total }
  }

  async updatePost(slug: string, data: UpdatePostRequest): Promise<void> {
    await this.repository.update({ slug }, data)
  }

  async deletePost(slug: string): Promise<void> {
    await this.repository.delete({ slug })
  }

  async getPublishedPost(slug: string): Promise<Post | null> {
    return this.repository
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
      .where('post.slug = :slug', { slug })
      .andWhere('post.status = :status', { status: BASE_STATUS.PUBLISHED })
      .getOne()
  }

  async getPublishedPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal> {
    const { page, limit, query, sort, categoryId } = options
    const skip = (page - 1) * limit

    const queryBuilder = this.repository
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
      .where('post.status = :status', { status: BASE_STATUS.PUBLISHED })

    if (query) {
      queryBuilder.andWhere('LOWER(post.title) LIKE LOWER(:query)', { query: `%${query}%` })
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId })
    }

    const [posts, total] = await queryBuilder
      .orderBy('post.createdAt', sort)
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    return { posts, total }
  }

  async getRelatedPosts(slug: string): Promise<Post[]> {
    const post = await this.getPost(slug)
    if (!post) return []

    return this.repository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tag')
      .where('post.status = :status', { status: BASE_STATUS.PUBLISHED })
      .andWhere('post.id != :id', { id: post.id })
      .groupBy('post.id')
      .addGroupBy('category.id')
      .addSelect(['category.id', 'category.name', 'category.slug'])
      .orderBy('post.createdAt', 'DESC')
      .distinct(true)
      .take(10)
      .getMany()
  }
}
