import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'
import { parseISO, isAfter, isValid } from 'date-fns'

@ValidatorConstraint({ name: 'isAfter', async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints
    const relatedValue = (args.object as any)[relatedPropertyName]

    const dateA = parseISO(relatedValue)
    const dateB = parseISO(value)

    return isValid(dateA) && isValid(dateB) && isAfter(dateB, dateA)
  }

  defaultMessage(args: ValidationArguments) {
    return 'Expiration date must be after activation date'
  }
}
