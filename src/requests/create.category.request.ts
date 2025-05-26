import { BASE_STATUS } from '@constants/base.status'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator'

export default class CreateCategoryRequest {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  thumbnail?: string

  @IsOptional()
  @IsString()
  icon?: string

  @IsOptional()
  @IsNumber({}, { message: 'Parent ID must be a number' })
  @Type(() => Number)
  parentId?: number

  @IsOptional()
  @IsEnum(BASE_STATUS, { message: 'Invalid status' })
  status!: (typeof BASE_STATUS)[keyof typeof BASE_STATUS]
}
