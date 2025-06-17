import { CustomValidator } from 'express-validator'
import { parseISO, isValid, isBefore, isAfter } from 'date-fns'

export const isDate: CustomValidator = value => {
  const date = parseISO(value)
  if (!isValid(date)) {
    throw new Error('The value must be a valid date.')
  }
  return true
}

export const before = (otherField: string): CustomValidator => {
  return (value, { req }) => {
    const query = req.query as Record<string, string>
    const date = parseISO(value)
    const other = parseISO(query[otherField])
    if (!isBefore(date, other)) {
      throw new Error(`This date must be before ${otherField}.`)
    }
    return true
  }
}

export const after = (otherField: string): CustomValidator => {
  return (value, { req }) => {
    const query = req.query as Record<string, string>
    const date = parseISO(value)
    const other = parseISO(query[otherField])
    if (!isAfter(date, other)) {
      throw new Error(`This date must be after ${otherField}.`)
    }
    return true
  }
}

export const beforeNow: CustomValidator = value => {
  const date = parseISO(value)
  if (!isBefore(date, new Date())) {
    throw new Error('This date must be before now.')
  }
  return true
}
