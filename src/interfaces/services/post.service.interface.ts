import { Post } from '@entities/post'
import { PostsWithTotal } from '@interfaces/contracts/post.contract'
import CreatePostRequest from '@requests/create.post.request'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdatePostREquest from '@requests/update.post.request'

export interface IPostService {
  createPost(data: CreatePostRequest): Promise<Post>
  getPost(slug: string): Promise<Post>
  getPosts(options: QueryFilterRequest): Promise<PostsWithTotal>
  updatePost(slug: string, data: UpdatePostREquest): Promise<Post>
  deletePost(id: number): Promise<void>
  getPublishedPost(slug: string): Promise<Post>
  getPublishedPosts(options: QueryFilterPublishedPostRequest): Promise<PostsWithTotal>
  getRelatedPosts(slug: string): Promise<Post[]>
}
