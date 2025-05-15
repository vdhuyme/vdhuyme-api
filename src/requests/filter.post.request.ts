import { Transform } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator'

export default class FilterPostRequest {
  @IsOptional()
  @IsString()
  query?: string

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number = 10

  @IsOptional()
  @IsIn(['DESC', 'ASC'])
  sort: 'DESC' | 'ASC' = 'DESC'
}
