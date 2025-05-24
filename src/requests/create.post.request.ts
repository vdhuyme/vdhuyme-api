import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  MinLength,
  ArrayMinSize
} from 'class-validator'
import { Type } from 'class-transformer'

export default class CreatePostRequest {
  @IsString({ message: 'Title must be a string' })
  @Length(3, 1000, { message: 'Title must be between 3 and 1000 characters' })
  title!: string

  @IsString({ message: 'Excerpt must be a string' })
  @Length(3, 1000, { message: 'Excerpt must be between 3 and 1000 characters' })
  excerpt!: string

  @IsString({ message: 'Content must be a string' })
  @MinLength(10, { message: 'Content must be at least 10 characters' })
  content!: string

  @IsOptional()
  @IsString({ message: 'Thumbnail must be a string' })
  thumbnail?: string

  @IsOptional()
  @IsString({ message: 'Read time must be a string' })
  readTime?: string

  @IsNumber({}, { message: 'Category ID must be a number' })
  @Min(1, { message: 'Category ID must be at least 1' })
  categoryId!: number

  @IsArray({ message: 'Tags must be an array' })
  @ArrayMinSize(0)
  @Type(() => Number)
  @IsInt({ each: true, message: 'Each tag must be an integer' })
  @Min(1, { each: true, message: 'Each tag ID must be at least 1' })
  tagIds!: number[]
}
