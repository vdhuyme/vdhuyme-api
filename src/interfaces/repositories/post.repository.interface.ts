import { Post } from '@entities/post'
import { PostsWithTotal } from '@interfaces/contracts/post.contract'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'

export interface IPostRepository {
  createPost(data: Partial<Post>): Promise<void>
  getPost(slug: string): Promise<Post | null>
  getPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal>
  updatePost(data: Partial<Post>): Promise<void>
  deletePost(slug: string): Promise<void>
  getPublishedPost(slug: string): Promise<Post | null>
  getPublishedPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal>
  getRelatedPosts(slug: string, limit?: number): Promise<Post[]>
}
