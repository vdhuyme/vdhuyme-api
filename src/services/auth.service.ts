import { User } from '@entities/user'
import { IUserRepository } from '@interfaces/repositories/user.repository.interface'
import { IAuthService } from '@interfaces/services/auth.service.interface'
import LoginRequest from '@requests/login.request'
import { inject } from 'inversify'
import { OAuthProvider } from 'types'
import jsonwebtoken from '@config/jsonwebtoken'
import UnauthorizedException from '@exceptions/unauthorized.exception'
import { Hash } from '@config/hash'

export default class AuthService implements IAuthService {
  constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

  async login({ email, password }: LoginRequest): Promise<string> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!Hash.check(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const token = jsonwebtoken.generate({ userId: user.id, email: user.email })
    return token
  }

  async getUserInfo(userId: number): Promise<User> {
    const user = await this.userRepository.getUserInfo(userId)
    if (!user) {
      throw new UnauthorizedException('Not found user')
    }

    return user
  }

  redirect(provider: OAuthProvider): Promise<string> {
    throw new Error('Method not implemented.')
  }

  callback(provider: OAuthProvider): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
