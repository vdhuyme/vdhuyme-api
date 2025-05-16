import fs from 'fs'
import path from 'path'

import express, { NextFunction, Request, Response } from 'express'
import { OK } from '@utils/http.status.code'
import { storage } from '@utils/storage'
import BadRequestException from '@exceptions/bad.request.exception'
import { auth } from '@middlewares/authenticated'

const router = express.Router()

const parseJsonLines = (content: string) => {
  return content
    .split('\n')
    .filter(Boolean)
    .map(line => {
      try {
        return JSON.parse(line)
      } catch {
        return { parseError: true, raw: line }
      }
    })
}

router.get('/', auth(), (req: Request, res: Response, next: NextFunction) => {
  const { date, type } = req.query as { date?: string; type?: 'combined' | 'error' }

  const logDir: string = storage.storagePath('logs')
  const selectedDate = date || new Date().toISOString().slice(0, 10)
  const selectedType = type || 'combined'
  const logFileName = `${selectedType}-${selectedDate}.json`
  const logFilePath = path.join(logDir, logFileName)
  if (!fs.existsSync(logFilePath)) {
    return next(new BadRequestException(`Not found ${logFileName} file`))
  }
  const fileContent = fs.readFileSync(logFilePath, 'utf-8')
  const logs = parseJsonLines(fileContent)

  res.status(OK).json({
    date: selectedDate,
    type: selectedType,
    logs
  })
})

export default router
