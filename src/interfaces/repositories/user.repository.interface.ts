import { User } from '@entities/user'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
  getUserInfo(userId: number): Promise<User | null>
}
