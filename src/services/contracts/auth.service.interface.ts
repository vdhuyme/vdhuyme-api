import { IUserResponse } from '@mappers/user.mapper'

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
}
