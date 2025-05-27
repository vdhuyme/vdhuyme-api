import { User } from '@entities/user'
import { IUserRepository } from '@repositories/contracts/user.repository.interface'
import BaseRepository from '@repositories/implements/base.repository'
import { dataSource } from 'data-source'

export default class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super(User, dataSource)
  }
}
