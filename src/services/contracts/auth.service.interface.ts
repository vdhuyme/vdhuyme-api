import { User } from '@entities/user'
import { IUserResponse } from '@mappers/user.mapper'
import { DeepPartial } from 'typeorm'

export interface IAuthResponse {
  accessToken: string
  refreshToken: string
}

export interface IAuthService {
  login(email: string, password: string): Promise<IAuthResponse>
  refreshAccessToken(refreshToken: string): string
  getUserInfo(userId: number): Promise<IUserResponse>
  redirect(): string
  callback(code: string): Promise<IAuthResponse>
  changePassword(userId: number | string, oldPassword: string, newPassword: string): Promise<User>
  register(name: string, email: string, password: string): Promise<IAuthResponse>
  updateProfile(id: string | number, data: DeepPartial<User>): Promise<User>
}
