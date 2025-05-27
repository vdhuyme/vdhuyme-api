import { User } from '@entities/user'

export interface IAuthResponse {
  accessToken: string
  refreshToken: string
}

export interface IAuthService {
  login(email: string, password: string): Promise<IAuthResponse>
  refreshAccessToken(refreshToken: string): string
  getUserInfo(userId: number): Promise<User>
  redirect(): string
  callback(code: string): Promise<IAuthResponse>
}
