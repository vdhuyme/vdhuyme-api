import { Post } from '@entities/post'
import { IPostRepository, PostsWithTotal } from '@interfaces/index'
import CreatePostRequest from '@requests/create.post.request'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdatePostREquest from '@requests/update.post.request'
import { ds } from 'data-source'
import { injectable } from 'inversify'
import { Repository } from 'typeorm'

@injectable()
export default class PostRepository implements IPostRepository {
  repository: Repository<Post>

  constructor() {
    this.repository = ds.getRepository<Post>(Post)
  }

  async createPost(data: CreatePostRequest): Promise<Post> {
    const post = this.repository.create(data)
    return this.repository.save(post)
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

  async getPosts(options: QueryFilterRequest): Promise<PostsWithTotal> {
    const { page, limit, query, sort } = options
    const skip = (page - 1) * limit

    const queryBuilder = this.repository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.email'])

    if (query) {
      queryBuilder.andWhere('LOWER(post.title) LIKE LOWER(:query)', { query: `%${query}%` })
    }

    queryBuilder
      .orderBy('post.createdAt', sort as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit)

    const [posts, total] = await queryBuilder.getManyAndCount()

    return { posts, total }
  }

  async updatePost(slug: string, data: UpdatePostREquest): Promise<Post> {
    await this.repository.update(slug, data)
    const updated = await this.getPost(slug)
    if (!updated) {
      throw new Error(`Post not found ${slug}`)
    }
    return updated
  }

  async deletePost(id: number): Promise<void> {
    await this.repository.delete(id)
  }

  async getPublishedPost(slug: string): Promise<Post | null> {
    throw new Error('Method not implemented.')
  }

  async getPublishedPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal> {
    throw new Error('Method not implemented.')
  }

  async getRelatedPosts(slug: string): Promise<Post[]> {
    throw new Error('Method not implemented.')
  }
}
