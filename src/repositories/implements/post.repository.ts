import { TYPES } from '@constants/types'
import { Post } from '@entities/post'
import BaseRepository from '@repositories/implements/base.repository'
import { inject } from 'inversify'
import { DataSource } from 'typeorm'

export default class PostRepository extends BaseRepository<Post> {
  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    super(Post, dataSource)
  }
}
