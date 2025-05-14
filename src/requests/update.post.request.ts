import { IsArray, IsOptional, IsString, Length, MinLength } from 'class-validator'

export default class UpdatePostRequest {
  @IsString({ message: 'Title must be a string' })
  @Length(3, 1000, { message: 'Title must be between 3 and 1000 characters' })
  title!: string

  @IsString({ message: 'Description must be a string' })
  @Length(3, 10000, { message: 'Description must be between 3 and 10000 characters' })
  description!: string

  @IsString({ message: 'Content must be a string' })
  @MinLength(10, { message: 'Content must be at least 10 characters' })
  content!: string

  @IsOptional()
  @IsString({ message: 'Thumbnail must be a string' })
  thumbnail?: string

  @IsOptional()
  @IsArray({ message: 'Images must be an array of strings' })
  @IsString({ each: true, message: 'Each image must be a string' })
  images?: string[]
}
