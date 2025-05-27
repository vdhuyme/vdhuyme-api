import { Post } from '@entities/post'
import BaseRepository from '@repositories/implements/base.repository'
import { dataSource } from 'data-source'

export default class PostRepository extends BaseRepository<Post> {
  constructor() {
    super(Post, dataSource)
  }
}
