import jwt, { JwtPayload } from 'jsonwebtoken'

interface IJsonWebToken {
  generate(data: Record<string, any>, expiresIn?: number): string
  verify(token: string): JwtPayload | string
}

class JsonWebToken implements IJsonWebToken {
  private tokenKey: string
  private expiresIn: number

  constructor() {
    this.tokenKey = process.env.TOKEN_KEY as string
    this.expiresIn = Number(process.env.TOKEN_EXP_TIME)
  }

  generate(data: Record<string, any>, expiresIn?: number): string {
    return jwt.sign(data, this.tokenKey, { expiresIn: expiresIn || this.expiresIn })
  }

  verify(token: string): JwtPayload | string {
    return jwt.verify(token, this.tokenKey)
  }
}

const jsonwebtoken = new JsonWebToken()

export default jsonwebtoken
