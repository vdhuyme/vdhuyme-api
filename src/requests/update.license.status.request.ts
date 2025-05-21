import { IsEnum } from 'class-validator'
import { BASE_STATUS } from '@constants/base.status'

export default class UpdateLicenseStatusRequest {
  @IsEnum(BASE_STATUS, { message: 'Invalid status' })
  status!: (typeof BASE_STATUS)[keyof typeof BASE_STATUS]
}
