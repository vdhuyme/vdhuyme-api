/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken'
import { config } from '@config/app'
import { IJwtAuthUserPayload } from '@interfaces/common/json.web.token'

type TokenType = 'access' | 'refresh'

interface IJsonWebToken {
  generate(data: Record<string, any>, type?: TokenType, expiresIn?: number): string
  verify(token: string, type?: TokenType): IJwtAuthUserPayload
}

class JsonWebToken implements IJsonWebToken {
  private accessTokenKey = config.jwt.accessTokenSecretKey
  private refreshTokenKey = config.jwt.refreshTokenSecretKey
  private accessExpiresIn = config.jwt.accessTokenExpirationTime
  private refreshExpiresIn = config.jwt.refreshTokenExpirationTime

  generate(data: Record<string, any>, type: TokenType = 'access', expiresIn?: number): string {
    const secretKey = type === 'access' ? this.accessTokenKey : this.refreshTokenKey
    const expiresInTime =
      expiresIn || (type === 'access' ? this.accessExpiresIn : this.refreshExpiresIn)
    return jwt.sign(data, secretKey, { expiresIn: expiresInTime })
  }

  verify(token: string, type: TokenType = 'access'): IJwtAuthUserPayload {
    const secretKey = type === 'access' ? this.accessTokenKey : this.refreshTokenKey
    return jwt.verify(token, secretKey) as IJwtAuthUserPayload
  }
}

const jsonwebtoken = new JsonWebToken()
export default jsonwebtoken
