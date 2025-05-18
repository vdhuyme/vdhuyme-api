import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator'

export default class CreateCategoryRequest {
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
  @IsNumber({}, { message: 'parentId must be a number' })
  @Type(() => Number)
  parent?: number
}
