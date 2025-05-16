import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'
import { parseISO, isAfter, isValid } from 'date-fns'

@ValidatorConstraint({ name: 'isAfter', async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints
    const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName]

    if (typeof relatedValue !== 'string' || typeof value !== 'string') {
      return false
    }

    const dateA = parseISO(relatedValue)
    const dateB = parseISO(value)

    return isValid(dateA) && isValid(dateB) && isAfter(dateB, dateA)
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints
    return `${args.property} must be after ${relatedPropertyName}`
  }
}
