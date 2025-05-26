import { Transform } from 'class-transformer'
import {
  IsArray,
  IsDate,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested
} from 'class-validator'

class SortItem {
  @IsString()
  key: string

  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC'
}

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
  @Transform(({ obj }) => {
    const keys = obj.sortKey ?? []
    const orders = obj.sortOrder ?? []
    if (!Array.isArray(keys)) return []
    return keys.map((key: string, i: number) => ({
      key,
      order: orders[i] ?? 'ASC'
    }))
  })
  @IsArray()
  @ValidateNested({ each: true })
  sort?: SortItem[]

  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  startDate: Date

  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  endDate: Date
}
