import { IsString, Length, IsOptional } from 'class-validator'

export default class CreateTagRequest {
  @IsString()
  @Length(1, 255)
  name: string

  @IsString()
  @Length(1, 255)
  slug: string

  @IsOptional()
  @IsString()
  status?: string
}
