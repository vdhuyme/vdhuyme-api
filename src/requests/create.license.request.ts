import { IsISO8601, IsNotEmpty, IsString, Validate } from 'class-validator'
import { IsAfterConstraint } from '@validators/is-after.constraint'

export default class CreateLicenseRequest {
  @IsNotEmpty({ message: 'Licensed to is required' })
  @IsString({ message: 'Licensed to must be a string' })
  licensedTo!: string

  @IsNotEmpty({ message: 'Activation date is required' })
  @IsISO8601({}, { message: 'Activation date must be a valid ISO 8601 date' })
  activatedAt!: string

  @IsNotEmpty({ message: 'Expiration date is required' })
  @IsISO8601({}, { message: 'Expiration date must be a valid ISO 8601 date' })
  @Validate(IsAfterConstraint, ['activatedAt'], {
    message: 'Expiration date must be after activation date'
  })
  expiresAt!: string
}
