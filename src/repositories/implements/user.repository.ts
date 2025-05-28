import { User } from '@entities/user'
import { IUserRepository } from '@repositories/contracts/user.repository.interface'
import BaseRepository from '@repositories/implements/base.repository'
import { dataSource } from 'data-source'
import { FindOneOptions, DeepPartial } from 'typeorm'

export default class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
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
