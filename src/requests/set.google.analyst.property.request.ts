import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export default class SetGoogleAnalystPropertyRequest {
  @IsNotEmpty()
  @IsString()
  propertyId: string

  @IsBoolean()
  isEnabled: boolean
}
