import { Post } from '@entities/post'
import { PostsWithTotal } from '@interfaces/contracts/post.contract'
import CreatePostRequest from '@requests/create.post.request'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'
import UpdatePostRequest from '@requests/update.post.request'

export interface IPostRepository {
  createPost(data: CreatePostRequest): Promise<void>
  getPost(slug: string): Promise<Post | null>
  getPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal>
  updatePost(slug: string, data: UpdatePostRequest): Promise<void>
  deletePost(slug: string): Promise<void>
  getPublishedPost(slug: string): Promise<Post | null>
  getPublishedPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal>
  getRelatedPosts(slug: string): Promise<Post[]>
}
