import { Post } from '@entities/post'
import BadRequestException from '@exceptions/bad.request.exception'
import { IPostRepository, IPostService, PostsWithTotal } from '@interfaces/index'
import CreatePostRequest from '@requests/create.post.request'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdatePostREquest from '@requests/update.post.request'
import { inject, injectable } from 'inversify'

@injectable()
export default class PostService implements IPostService {
  constructor(@inject('IPostRepository') private postRepository: IPostRepository) {}

  async getPost(slug: string): Promise<Post> {
    const post = await this.postRepository.getPost(slug)
    if (!post) {
      throw new BadRequestException(`Not found post ${slug}`)
    }

    return post
  }

  async createPost(data: CreatePostRequest): Promise<Post> {
    const post = await this.postRepository.createPost(data)
    if (!post) {
      throw new BadRequestException('Failed to create post')
    }

    return post
  }

  async getPosts(options: QueryFilterRequest): Promise<PostsWithTotal> {
    const { posts, total } = await this.postRepository.getPosts(options)
    return { posts, total }
  }

  updatePost(slug: string, data: UpdatePostREquest): Promise<Post> {
    throw new Error('Method not implemented.')
  }

  deletePost(id: number): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getPublishedPost(slug: string): Promise<Post> {
    throw new Error('Method not implemented.')
  }

  getPublishedPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal> {
    throw new Error('Method not implemented.')
  }

  getRelatedPosts(slug: string): Promise<Post[]> {
    throw new Error('Method not implemented.')
  }
}
