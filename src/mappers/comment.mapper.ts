import { Comment } from '@entities/comment'
import { BASE_STATUS } from '@constants/base.status'
import { IUserResponse, UserResource } from '@mappers/user.mapper'

export interface ICommentResponse {
  id: number
  content: string
  status: string
  createdAt: Date
  updatedAt: Date
  user: IUserResponse | null
}

export class CommentResource {
  static fromEntity(comment: Comment): ICommentResponse {
    const isPublished = comment.status === BASE_STATUS.PUBLISHED

    return {
      id: comment.id,
      content: isPublished ? comment.content : 'This comment will be displayed until approved.',
      status: comment.status,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: UserResource.fromEntity(comment.user)
    }
  }

  static collection(comments: Comment[]): ICommentResponse[] {
    return comments.map(CommentResource.fromEntity)
  }
}
