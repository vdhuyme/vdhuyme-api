import { User } from '@entities/user'
import BaseRepository from '@repositories/implements/base.repository'
import { dataSource } from 'data-source'

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User, dataSource)
  }
}
