export interface IJwtAuthUserPayload {
  userId: number
  email: string
  iat?: number
  exp?: number
}
