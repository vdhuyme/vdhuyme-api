import { User } from '@entities/user'
import { IBaseRepository } from '@repositories/contracts/base.repository.interface'
import { DeepPartial, FindOneOptions } from 'typeorm'

export interface IUserRepository extends IBaseRepository<User> {
  findOrCreate(options: FindOneOptions, entityData: DeepPartial<User>): Promise<User>
}
