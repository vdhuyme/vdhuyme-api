import { storage } from '@utils/storage'
import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: storage.storagePath('logs/error.log'), level: 'error' }),
    new transports.File({ filename: storage.storagePath('logs/combined.log') })
  ]
})

export default logger
