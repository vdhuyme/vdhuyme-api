import { IsNotEmpty, IsString, Length } from 'class-validator'

export default class CreateCommentRequest {
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @Length(3, 1000, { message: 'Content must be between 3 and 1000 characters' })
  content!: string

  @IsNotEmpty({ message: 'Post slug is required' })
  @IsString({ message: 'Post slug must be a string' })
  postSlug!: string
}
