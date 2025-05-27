import { Comment } from '@entities/comment'
import { User } from '@entities/user'
import BaseRepository from '@repositories/implements/base.repository'
import { dataSource } from 'data-source'

export default class CommentRepository extends BaseRepository<Comment> {
  constructor() {
    super(User, dataSource)
  }
}
