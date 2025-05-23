import { Post } from '@entities/post'
import BadRequestException from '@exceptions/bad.request.exception'
import { IPostRepository, IPostService } from '@interfaces/index'
import CreatePostRequest from '@requests/create.post.request'
import { inject, injectable } from 'inversify'

@injectable()
export default class PostService implements IPostService {
  constructor(@inject('IPostRepository') private postRepository: IPostRepository) {}

  async getPost(slug: string): Promise<Post | null> {
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
}
