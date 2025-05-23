/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken'
import { config } from '@config/app'
import { IJwtAuthUserPayload } from '@interfaces/common/json.web.token'

interface IJsonWebToken {
  generateAccessToken(data: Record<string, any>, expiresIn?: number): string
  generateRefreshToken(data: Record<string, any>, expiresIn?: number): string
  verifyAccessToken(token: string): IJwtAuthUserPayload
  verifyRefreshToken(token: string): IJwtAuthUserPayload
}

class JsonWebToken implements IJsonWebToken {
  private accessTokenKey = config.jwt.accessTokenSecretKey
  private refreshTokenKey = config.jwt.refreshTokenSecretKey
  private accessExpiresIn = config.jwt.accessTokenExpirationTime
  private refreshExpiresIn = config.jwt.refreshTokenExpirationTime

  generateAccessToken(data: Record<string, any>, expiresIn?: number): string {
    return jwt.sign(data, this.accessTokenKey, { expiresIn: expiresIn || this.accessExpiresIn })
  }

  generateRefreshToken(data: Record<string, any>, expiresIn?: number): string {
    return jwt.sign(data, this.refreshTokenKey, { expiresIn: expiresIn || this.refreshExpiresIn })
  }

  verifyAccessToken(token: string): IJwtAuthUserPayload {
    return jwt.verify(token, this.accessTokenKey) as IJwtAuthUserPayload
  }

  verifyRefreshToken(token: string): IJwtAuthUserPayload {
    return jwt.verify(token, this.refreshTokenKey) as IJwtAuthUserPayload
  }
}

const jsonwebtoken = new JsonWebToken()
export default jsonwebtoken
