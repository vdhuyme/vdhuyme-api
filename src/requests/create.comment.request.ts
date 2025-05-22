import { IsNotEmpty, IsString, Length } from 'class-validator'

export default class CreateCommentRequest {
  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  slug: string

  @IsString({ message: 'Content must be a string' })
  @Length(3, 1000, { message: 'Content must be between 3 and 1000 characters' })
  content: string
}
