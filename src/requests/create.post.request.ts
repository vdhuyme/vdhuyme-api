import { IsArray, IsOptional, IsString, Length, MinLength, IsInt } from 'class-validator'

export default class CreatePostRequest {
  @IsString({ message: 'Title must be a string' })
  @Length(3, 1000, { message: 'Title must be between 3 and 1000 characters' })
  title!: string

  @IsString({ message: 'Description must be a string' })
  @Length(3, 1000, { message: 'Description must be between 3 and 1000 characters' })
  description!: string

  @IsString({ message: 'Content must be a string' })
  @MinLength(10, { message: 'Content must be at least 10 characters' })
  content!: string

  @IsOptional()
  @IsString({ message: 'Thumbnail must be a string' })
  thumbnail?: string

  @IsString({ message: 'Slug must be a string' })
  @Length(3, 1000, { message: 'Slug must be between 3 and 1000 characters' })
  slug!: string

  @IsOptional()
  @IsArray({ message: 'Categories must be an array of IDs' })
  @IsInt({ each: true, message: 'Each category ID must be a valid Integer' })
  categories?: number[]
}
