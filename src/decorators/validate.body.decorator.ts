import { createValidatorDecorator } from '@utils/validator'

export function body<T extends object>(dto: new () => T): MethodDecorator {
  return createValidatorDecorator(dto, 'body')
}
