export interface IJwtAuthUserPayload {
  userId: number
  email: string
  status: string
  iat?: number
  exp?: number
}
