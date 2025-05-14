import { IsEnum } from 'class-validator'
import BaseStatusEnum from '@enums/base.status.enum'

export default class UpdatePostStatusRequest {
  @IsEnum(BaseStatusEnum, { message: 'Invalid status' })
  status!: BaseStatusEnum
}
