/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata'
import { Request, Response, NextFunction } from 'express'
import { plainToInstance, ClassConstructor } from 'class-transformer'
import { validate } from 'class-validator'
import ValidationException from '@exceptions/validation.exception'

// Metadata keys
const BODY_KEY = Symbol('bodyValidation')
const PARAMS_KEY = Symbol('paramsValidation')
const QUERY_KEY = Symbol('queryValidation')
const ORIGINAL_METHOD_KEY = Symbol('originalMethod')

// Validation Options
interface ValidationOptions {
  skipMissingProperties?: boolean
  whitelist?: boolean
  forbidNonWhitelisted?: boolean
  transform?: boolean
}

interface ValidationMetadata {
  dto: ClassConstructor<any>
  options: ValidationOptions
}

// Validate + transform
const validateAndTransform = async (
  data: any,
  dto: ClassConstructor<any>,
  options: ValidationOptions
): Promise<any> => {
  const transformed = plainToInstance(dto, data, {
    enableImplicitConversion: options.transform
  })

  const errors = await validate(transformed, {
    skipMissingProperties: options.skipMissingProperties,
    whitelist: options.whitelist,
    forbidNonWhitelisted: options.forbidNonWhitelisted
  })

  if (errors.length > 0) {
    throw new ValidationException(errors)
  }

  return transformed
}

// Core method wrapper
const getOrWrapMethod = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  handlers: ((req: Request) => Promise<void>)[]
): void => {
  const original = Reflect.getMetadata(ORIGINAL_METHOD_KEY, target, propertyKey) || descriptor.value
  if (!Reflect.hasMetadata(ORIGINAL_METHOD_KEY, target, propertyKey)) {
    Reflect.defineMetadata(ORIGINAL_METHOD_KEY, original, target, propertyKey)
  }

  descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
    try {
      for (const handler of handlers) {
        await handler(req)
      }
      return await original.call(this, req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

// Factory
const createValidationDecorator = (key: symbol) => {
  return function <T extends ClassConstructor<any>>(dto: T, options?: ValidationOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const validationOptions: ValidationOptions = {
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        ...options
      }

      const metadata: ValidationMetadata = { dto, options: validationOptions }
      Reflect.defineMetadata(key, metadata, target, propertyKey)

      const handler = async (req: Request) => {
        const meta: ValidationMetadata = Reflect.getMetadata(key, target, propertyKey)
        if (!meta) return

        const sourceMap: Record<symbol, any> = {
          [BODY_KEY]: req.body,
          [PARAMS_KEY]: req.params,
          [QUERY_KEY]: req.query
        }

        const source = sourceMap[key]
        const validated = await validateAndTransform(source, meta.dto, meta.options)

        // Assign validated to the correct place
        switch (key) {
          case BODY_KEY:
            req.body = validated
            break
          case PARAMS_KEY:
            req.params = validated
            break
          case QUERY_KEY:
            req.query = validated
            break
        }
      }

      const existingHandlers: ((req: Request) => Promise<void>)[] =
        Reflect.getMetadata('handlers', target, propertyKey) || []

      Reflect.defineMetadata('handlers', [...existingHandlers, handler], target, propertyKey)

      getOrWrapMethod(target, propertyKey, descriptor, [...existingHandlers, handler])

      return descriptor
    }
  }
}

// Export decorators
export const body = createValidationDecorator(BODY_KEY)
export const params = createValidationDecorator(PARAMS_KEY)
export const query = createValidationDecorator(QUERY_KEY)
