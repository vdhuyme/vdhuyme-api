import { Post } from '@entities/post'
import { PostsWithTotal } from '@interfaces/contracts/post.contract'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'
import QueryFilterRequest from '@requests/query.filter.request'

export interface IPostService {
  createPost(data: Partial<Post>, userId: number): Promise<void>
  getPost(slug: string): Promise<Post>
  getPosts(options: QueryFilterRequest): Promise<PostsWithTotal>
  updatePost(slug: string, data: Partial<Post>): Promise<void>
  deletePost(slug: string): Promise<void>
  getPublishedPost(slug: string): Promise<Post>
  getPublishedPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal>
  getRelatedPosts(slug: string, limit: number): Promise<Post[]>
}
