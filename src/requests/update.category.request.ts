import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator'

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
  @IsNumber({ allowNaN: false }, { message: 'parentId must be a number' })
  @Min(1, { message: 'Parent ID gte 1' })
  parentId?: number
}
