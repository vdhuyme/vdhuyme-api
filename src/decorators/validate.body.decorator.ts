import { createValidatorDecorator } from '@utils/validator.decorator'

export function body<T extends object>(dto: new () => T): MethodDecorator {
  return createValidatorDecorator(dto, 'body')
}
