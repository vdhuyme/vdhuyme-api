import { createValidatorDecorator } from '@utils/validator.decorator'

export function query<T extends object>(dto: new () => T): MethodDecorator {
  return createValidatorDecorator(dto, 'query')
}
