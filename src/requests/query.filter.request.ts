import { Transform } from 'class-transformer'
import { IsDate, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator'

export default class QueryFilterRequest {
  @IsOptional()
  @IsString()
  query?: string

  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1

  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number = 50

  @IsOptional()
  @IsIn(['DESC', 'ASC'])
  sort: 'DESC' | 'ASC' = 'DESC'

  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  startDate: Date

  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  endDate: Date
}
