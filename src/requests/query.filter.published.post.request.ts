import QueryFilterRequest from '@requests/query.filter.request'
import { IsNumber, IsOptional, Min } from 'class-validator'

export default class QueryFilterPublishedPostRequest extends QueryFilterRequest {
  @IsOptional()
  @IsNumber({}, { message: 'Category ID must be a number' })
  @Min(1, { message: 'Category ID must be at least 1' })
  categoryId!: number
}
