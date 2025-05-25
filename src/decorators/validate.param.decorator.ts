import { createValidatorDecorator } from '@utils/validator.decorator'

export function params<T extends object>(dto: new () => T): MethodDecorator {
  return createValidatorDecorator(dto, 'params')
}
