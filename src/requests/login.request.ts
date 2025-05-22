import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export default class LoginRequest {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password!: string
}
