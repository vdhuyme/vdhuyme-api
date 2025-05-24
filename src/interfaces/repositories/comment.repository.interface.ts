import { Comment } from '@entities/comment'
import { CommentsWithTotal } from '@interfaces/contracts/comment.contract'
import QueryFilterCommentRequest from '@requests/query.filter.comment.request'

export interface ICommentRepository {
  getComments(options: QueryFilterCommentRequest): Promise<CommentsWithTotal>
  getCommentsByPostSlug(
    postSlug: string,
    options: QueryFilterCommentRequest
  ): Promise<CommentsWithTotal>
  getCommentById(id: number): Promise<Comment | null>
  createComment(data: Partial<Comment>): Promise<void>
  updateComment(data: Partial<Comment>): Promise<void>
  deleteComment(id: number): Promise<void>
}
