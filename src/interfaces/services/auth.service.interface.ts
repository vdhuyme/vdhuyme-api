import { User } from '@entities/user'
import LoginRequest from '@requests/login.request'
import { OAuthProvider } from 'types'

export interface IAuthService {
  login({ email, password }: LoginRequest): Promise<string>
  getUserInfo(userId: number): Promise<User>
  redirect(provider: OAuthProvider): Promise<string>
  callback(provider: OAuthProvider): Promise<string>
}
