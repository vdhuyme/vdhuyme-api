import type { Response } from 'express'
import { OK } from '@constants/http.status.code'

export function jsonResponse<T>(res: Response, data: T, status = OK, message?: string) {
  return res.status(status).json({ status, message: message || null, data: data ?? null })
}
