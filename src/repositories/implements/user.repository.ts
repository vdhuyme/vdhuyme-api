import { TYPES } from '@constants/types'
import { User } from '@entities/user'
import { IUserRepository } from '@repositories/contracts/user.repository.interface'
import BaseRepository from '@repositories/implements/base.repository'
import { inject } from 'inversify'
import { FindOneOptions, DeepPartial, DataSource } from 'typeorm'

export default class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    super(User, dataSource)
  }

  async save(entity: DeepPartial<User>): Promise<User> {
    const userRepository = this.getRepository()
    const user = userRepository.create(entity)
    return userRepository.save(user)
  }

  async findOrCreate(options: FindOneOptions, entityData: DeepPartial<User>): Promise<User> {
    const existingUser = await this.findOne(options)
    return existingUser ? existingUser : this.save(entityData)
  }
}
