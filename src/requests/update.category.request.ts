import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator'

export default class UpdateCategoryRequest {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  slug: string

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
  @IsString()
  status: string
}
