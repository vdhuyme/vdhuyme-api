import { Post } from '@entities/post'
import CreatePostRequest from '@requests/create.post.request'

export interface IPostService {
  getPost(slug: string): Promise<Post | null>
  createPost(data: CreatePostRequest): Promise<Post>
}
