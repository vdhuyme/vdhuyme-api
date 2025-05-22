import { BASE_STATUS } from '@constants/base.status'
import { IsEnum } from 'class-validator'

export default class UpdateCommentStatusRequest {
  @IsEnum(BASE_STATUS, { message: 'Invalid status' })
  status!: (typeof BASE_STATUS)[keyof typeof BASE_STATUS]
}
