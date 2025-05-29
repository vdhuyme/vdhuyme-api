import { TYPES } from '@constants/types'
import { Comment } from '@entities/comment'
import { ICommentRepository } from '@repositories/contracts/comment.repository.interface'
import BaseRepository from '@repositories/implements/base.repository'
import { inject } from 'inversify'
import { DataSource } from 'typeorm'

export default class CommentRepository
  extends BaseRepository<Comment>
  implements ICommentRepository
{
  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    super(Comment, dataSource)
  }
}
