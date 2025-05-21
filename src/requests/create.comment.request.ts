import { Type } from 'class-transformer'
import { IsNumber, IsString, Length } from 'class-validator'

export default class CreateCommentRequest {
  @IsNumber({}, { message: 'Post ID must be a number' })
  @Type(() => Number)
  postId?: number

  @IsString({ message: 'Content must be a string' })
  @Length(3, 1000, { message: 'Content must be between 3 and 1000 characters' })
  content: string
}
