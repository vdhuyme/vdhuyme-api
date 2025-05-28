import { TYPES } from '@constants/types'
import { Comment } from '@entities/comment'
import { User } from '@entities/user'
import BaseRepository from '@repositories/implements/base.repository'
import { inject } from 'inversify'
import { DataSource } from 'typeorm'

export default class CommentRepository extends BaseRepository<Comment> {
  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    super(User, dataSource)
  }
}
