import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export default class SendContactRequest {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  message: string
}
