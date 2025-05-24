import { User } from '@entities/user'
import { IUserRepository } from '@interfaces/repositories/user.repository.interface'
import { ds } from 'data-source'
import { Repository } from 'typeorm'

export default class UserRepository implements IUserRepository {
  repository: Repository<User>

  constructor() {
    this.repository = ds.getRepository<User>(User)
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } })
  }

  createUser(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data)
    return this.repository.save(user)
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

  async findOrCreate(data: Partial<User>): Promise<User> {
    if (!data.email) {
      throw new Error('Email is required to find or create user')
    }

    const user = await this.findByEmail(data.email)
    if (user) {
      return user
    }

    const newUser = this.repository.create(data)
    return this.repository.save(newUser)
  }
}
