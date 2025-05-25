import { IsNotEmpty, IsString } from 'class-validator'

export default class RefreshTokenRequest {
  @IsNotEmpty()
  @IsString()
  refreshToken: string
}
