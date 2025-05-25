import { BASE_STATUS } from '@constants/base.status'
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator'

export default class UpdateCommentRequest {
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @Length(3, 1000, { message: 'Content must be between 3 and 1000 characters' })
  content!: string

  @IsEnum(BASE_STATUS, { message: 'Invalid status' })
  status!: (typeof BASE_STATUS)[keyof typeof BASE_STATUS]
}
