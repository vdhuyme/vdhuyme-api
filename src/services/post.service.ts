import { Post } from '@entities/post'
import BadRequestException from '@exceptions/bad.request.exception'
import { IPostRepository, IPostService, PostsWithTotal } from '@interfaces/index'
import CreatePostRequest from '@requests/create.post.request'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'
import UpdatePostRequest from '@requests/update.post.request'
import { inject, injectable } from 'inversify'

@injectable()
export default class PostService implements IPostService {
  constructor(@inject('IPostRepository') private postRepository: IPostRepository) {}

  async createPost(data: CreatePostRequest): Promise<void> {
    // const author = await userRepository.findOneByOrFail({ id: userId })
    // const category = await categoryRepository.findOneByOrFail({ id: categoryId })
    // const tags = await tagRepository.find({ where: { id: In(tagIds) } })

    await this.postRepository.createPost(data)
  }

  async updatePost(slug: string, data: UpdatePostRequest): Promise<Post> {
    throw new Error('Method not implemented.')
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
    throw new Error('Method not implemented.')
  }

  async getPublishedPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal> {
    throw new Error('Method not implemented.')
  }

  async getRelatedPosts(slug: string): Promise<Post[]> {
    throw new Error('Method not implemented.')
  }
}
