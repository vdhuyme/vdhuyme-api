import { User } from '@entities/user'

export interface IUserResponse {
  id: number
  name: string
  email: string
  status: string
  avatar?: string | null
  phoneNumber?: string | null
  createdAt: Date
  updatedAt: Date
}

export class UserResource {
  static fromEntity(user: User): IUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  static collection(users: User[]): IUserResponse[] {
    return users.map(UserResource.fromEntity)
  }
}
