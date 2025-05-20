import { IsOptional, IsString, Length, MinLength } from 'class-validator'

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

  @IsString({ message: 'Slug must be a string' })
  @Length(3, 1000, { message: 'Slug must be between 3 and 1000 characters' })
  slug!: string
}
