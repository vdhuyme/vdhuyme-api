import { User } from '@entities/user'
import { IUserRepository } from '@interfaces/repositories/user.repository.interface'
import { ds } from 'data-source'
import { Repository } from 'typeorm'

export default class UserRepository implements IUserRepository {
  repository: Repository<User>

  constructor() {
    this.repository = ds.getRepository<User>(User)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } })
  }

  async getUserInfo(userId: number): Promise<User | null> {
    return this.repository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.avatar',
        'user.email',
        'user.name',
        'user.status',
        'user.createdAt',
        'user.updatedAt'
      ])
      .where('user.id = :userId', { userId })
      .getOne()
  }
}
