import { User } from '@entities/user'
import { LoginResponse } from '@interfaces/contracts/auth.contract'
import LoginRequest from '@requests/login.request'

export interface IAuthService {
  login({ email, password }: LoginRequest): Promise<LoginResponse>
  refreshAccessToken(refreshToken: string): string
  getUserInfo(userId: number): Promise<User>
  redirect(): string
  callback(code: string): Promise<LoginResponse>
}
