import { IsNotEmpty, IsString } from 'class-validator'

export default class GetLicenseRequest {
  @IsNotEmpty({ message: 'Token is required' })
  @IsString({ message: 'Token must be a string' })
  token!: string
}
