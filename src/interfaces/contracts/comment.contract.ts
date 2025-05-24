import { Comment } from '@entities/comment'

export interface CommentsWithTotal {
  comments: Comment[] | []
  total: number | 0
}
