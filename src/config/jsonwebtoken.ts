/* eslint-disable @typescript-eslint/no-explicit-any */
import { IJwtAuthUserPayload } from '@interfaces/common/json.web.token'
import jwt from 'jsonwebtoken'

interface IJsonWebToken {
  generate(data: Record<string, any>, expiresIn?: number): string
  verify(token: string): IJwtAuthUserPayload
}

class JsonWebToken implements IJsonWebToken {
  private tokenKey: string
  private expiresIn: number

  constructor() {
    this.tokenKey = process.env.TOKEN_KEY as string
    this.expiresIn = parseInt(process.env.TOKEN_EXP_TIME as string, 10)
  }

  generate(data: Record<string, any>, expiresIn?: number): string {
    return jwt.sign(data, this.tokenKey, { expiresIn: expiresIn || this.expiresIn })
  }

  verify(token: string): IJwtAuthUserPayload {
    const decoded = jwt.verify(token, this.tokenKey)
    return decoded as IJwtAuthUserPayload
  }
}

const jsonwebtoken = new JsonWebToken()

export default jsonwebtoken
