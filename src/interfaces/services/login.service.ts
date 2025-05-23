import LoginRequest from '@requests/login.request'
import { OAuthProvider } from 'types'

export interface ILoginService {
  login({ email, password }: LoginRequest): Promise<string>
  redirect(provider: OAuthProvider): Promise<string>
  callback(provider: OAuthProvider): Promise<string>
}
