import { TYPES } from '@constants/types'
import { User } from '@entities/user'
import { IUserRepository } from '@repositories/contracts/user.repository.interface'
import BaseRepository from '@repositories/implements/base.repository'
import { inject } from 'inversify'
import { DataSource } from 'typeorm'

export default class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    super(User, dataSource)
  }
}
