import QueryFilterRequest from '@requests/query.filter.request'
import { IsNumber, IsOptional, Min } from 'class-validator'

export default class QueryFilterCommentRequest extends QueryFilterRequest {
  @IsOptional()
  @IsNumber({}, { message: 'User ID must be a number' })
  @Min(1, { message: 'User ID must be at least 1' })
  userId?: number | null
}
