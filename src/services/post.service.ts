import { Post } from '@entities/post'
import BadRequestException from '@exceptions/bad.request.exception'
import { IPostRepository, IPostService, PostsWithTotal } from '@interfaces/index'
import { ICategoryRepository } from '@interfaces/repositories/category.repository.interface'
import { ITagRepository } from '@interfaces/repositories/tag.repository.interface'
import { IUserRepository } from '@interfaces/repositories/user.repository.interface'
import CreatePostRequest from '@requests/create.post.request'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'
import UpdatePostRequest from '@requests/update.post.request'
import { inject, injectable } from 'inversify'

@injectable()
export default class PostService implements IPostService {
  constructor(
    @inject('IPostRepository') private postRepository: IPostRepository,
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('ICategoryRepository') private categoryRepository: ICategoryRepository,
    @inject('ITagRepository') private tagRepository: ITagRepository
  ) {}

  async createPost(data: CreatePostRequest, userId: number): Promise<void> {
    const { categoryId, tagIds, ...rest } = data
    const author = await this.userRepository.findById(userId)
    if (!author) {
      throw new BadRequestException(`Not found user ${userId}`)
    }

    const category = await this.categoryRepository.getCategoryById(categoryId)
    if (!category) {
      throw new BadRequestException(`Not found category ${categoryId}`)
    }

    const uniqueTagIds = Array.from(new Set(tagIds))
    const tags = await this.tagRepository.findManyByIds(uniqueTagIds)

    await this.postRepository.createPost({ ...rest, author, category, tags })
  }

  async updatePost(slug: string, data: UpdatePostRequest): Promise<void> {
    const post = await this.postRepository.getPost(slug)
    if (!post) {
      throw new BadRequestException(`Not found post ${slug}`)
    }

    const { categoryId, tagIds, ...rest } = data

    const category = await this.categoryRepository.getCategoryById(categoryId)
    if (!category) {
      throw new BadRequestException(`Not found category ${categoryId}`)
    }
    post.category = category

    const uniqueTagIds = Array.from(new Set(tagIds))
    const tags = await this.tagRepository.findManyByIds(uniqueTagIds)
    post.tags = tags

    Object.assign(post, rest)

    await this.postRepository.updatePost(post)
  }

  async getPost(slug: string): Promise<Post> {
    const post = await this.postRepository.getPost(slug)
    if (!post) {
      throw new BadRequestException(`Not found post ${slug}`)
    }

    return post
  }

  async getPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal> {
    const { posts, total } = await this.postRepository.getPosts(options)
    return { posts, total }
  }

  async deletePost(slug: string): Promise<void> {
    const post = await this.postRepository.getPost(slug)
    if (!post) {
      throw new BadRequestException(`Not found post ${slug}`)
    }

    await this.postRepository.deletePost(slug)
  }

  async getPublishedPost(slug: string): Promise<Post> {
    const post = await this.postRepository.getPublishedPost(slug)
    if (!post) {
      throw new BadRequestException(`Not found published post ${slug}`)
    }

    return post
  }

  async getPublishedPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal> {
    const { posts, total } = await this.postRepository.getPublishedPosts(options)
    return { posts, total }
  }

  async getRelatedPosts(slug: string, limit?: number): Promise<Post[]> {
    const post = await this.postRepository.getPost(slug)
    if (!post) {
      throw new BadRequestException(`Not found post ${slug}`)
    }

    return this.postRepository.getRelatedPosts(slug, limit)
  }
}
