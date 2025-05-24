import { CommentsWithTotal } from '@interfaces/contracts/comment.contract'
import CreateCommentRequest from '@requests/create.comment.request'
import QueryFilterCommentRequest from '@requests/query.filter.comment.request'
import UpdateCommentRequest from '@requests/update.comment.request'

export interface ICommentService {
  getComments(options: QueryFilterCommentRequest): Promise<CommentsWithTotal>
  getCommentsByPostSlug(
    postSlug: string,
    options: QueryFilterCommentRequest
  ): Promise<CommentsWithTotal>
  createComment(data: CreateCommentRequest, userId: number): Promise<void>
  updateComment(id: number, data: UpdateCommentRequest): Promise<void>
  deleteComment(id: number): Promise<void>
}
