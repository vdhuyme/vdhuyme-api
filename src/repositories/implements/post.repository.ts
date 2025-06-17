import { TYPES } from '@constants/types'
import { Post } from '@entities/post'
import { IPostRepository } from '@repositories/contracts/post.repository.interface'
import BaseRepository from '@repositories/implements/base.repository'
import { inject } from 'inversify'
import { DataSource } from 'typeorm'

export default class PostRepository extends BaseRepository<Post> implements IPostRepository {
  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    super(Post, dataSource)
  }
}
