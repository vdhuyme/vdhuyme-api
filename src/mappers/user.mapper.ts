import { ROLES_PERMISSIONS } from '@config/permissions'
import { User } from '@entities/user'

export interface IUserResponse {
  id: number
  name: string
  email: string
  status: string
  superUser: number
  avatar?: string | null
  phoneNumber?: string | null
  roles: string[]
  permissions: string[]
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
      superUser: user.superUser,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      roles: user.roles,
      permissions: Array.from(new Set(user.roles?.flatMap(role => ROLES_PERMISSIONS[role]) || [])),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  static collection(users: User[]): IUserResponse[] {
    return users.map(UserResource.fromEntity)
  }
}
