import { BASE_STATUS } from '@constants/base.status'
import { IsString, Length, IsOptional, IsEnum } from 'class-validator'

export default class CreateTagRequest {
  @IsString()
  @Length(1, 255)
  name: string

  @IsOptional()
  @IsEnum(BASE_STATUS, { message: 'Invalid status' })
  status!: (typeof BASE_STATUS)[keyof typeof BASE_STATUS]
}
