import { User } from '@entities/user'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: number): Promise<User | null>
  getUserInfo(userId: number): Promise<User | null>
  createUser(data: Partial<User>): Promise<User>
  findOrCreate(data: Partial<User>): Promise<User>
}
