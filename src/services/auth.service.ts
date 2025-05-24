import { User } from '@entities/user'
import { IUserRepository } from '@interfaces/repositories/user.repository.interface'
import { IAuthService } from '@interfaces/services/auth.service.interface'
import LoginRequest from '@requests/login.request'
import { inject } from 'inversify'
import jsonwebtoken from '@config/jsonwebtoken'
import UnauthorizedException from '@exceptions/unauthorized.exception'
import { Hash } from '@config/hash'
import { googleOAuth2Client } from '@config/google.oauth2'
import { BASE_STATUS } from '@constants/base.status'
import { LoginResponse } from '@interfaces/index'

export default class AuthService implements IAuthService {
  constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

  async login({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!Hash.check(password, user.password) || user.status === BASE_STATUS.BLOCKED) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const accessToken = jsonwebtoken.generate({ userId: user.id, email: user.email })
    const refreshToken = jsonwebtoken.generate({ userId: user.id, email: user.email }, 'refresh')

    return { accessToken, refreshToken }
  }

  async getUserInfo(userId: number): Promise<User> {
    const user = await this.userRepository.getUserInfo(userId)
    if (!user) {
      throw new UnauthorizedException('Not found user')
    }

    return user
  }

  redirect(): string {
    const scope: string[] = ['https://www.googleapis.com/auth/userinfo.profile', 'email']
    const url: string = googleOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope,
      prompt: 'consent'
    })

    return url
  }

  async callback(code: string): Promise<LoginResponse> {
    const responseToken = await googleOAuth2Client.getToken(code)
    const tokenId = responseToken.tokens.id_token
    if (!tokenId) {
      throw new UnauthorizedException('Token is invalid.')
    }

    const verifiedPayload = await googleOAuth2Client.verifyIdToken({ idToken: tokenId })
    const socialAccount = verifiedPayload.getPayload()
    if (!socialAccount) {
      throw new UnauthorizedException('Can not extract user information.')
    }

    const { email, name, picture } = socialAccount
    const user = await this.userRepository.findOrCreate({ email, name, avatar: picture })
    if (user.status === BASE_STATUS.BLOCKED) {
      throw new UnauthorizedException('Your account has been blocked.')
    }

    const accessToken = jsonwebtoken.generate({ userId: user.id, email: user.email })
    const refreshToken = jsonwebtoken.generate({ userId: user.id, email: user.email }, 'refresh')

    return { accessToken, refreshToken }
  }

  refreshAccessToken(refreshToken: string): string {
    try {
      const decoded = jsonwebtoken.verify(refreshToken, 'refresh')
      const { userId, email } = decoded
      const token = jsonwebtoken.generate({ userId, email })
      return token
    } catch (error: unknown) {
      const messages: Record<string, string> = {
        JsonWebTokenError: 'Invalid token',
        TokenExpiredError: 'Token has expired'
      }
      const name = (error as { name: string }).name
      const message = messages[name] || 'Exception from refresh access token service'

      throw new UnauthorizedException(message)
    }
  }
}
