import { Post } from '@entities/post'

export interface PostsWithTotal {
  posts: Post[] | []
  total: number | 0
}
