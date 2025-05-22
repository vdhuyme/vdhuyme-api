import 'dotenv/config'
import 'reflect-metadata'
import express, { Application } from 'express'
import { errorHandler } from '@middlewares/error.handler'
import router from '@routes/v1'
import cors from 'cors'
import { notFound } from '@middlewares/not.found'
import logger from '@config/logging'
import { database } from 'data-source'
import helmet from 'helmet'
import compression from 'compression'

const app: Application = express()

async function bootstrap(): Promise<void> {
  const port: number = parseInt(process.env.PORT as string)
  const host: string = process.env.APP_URL as string
  const version: string = process.env.VERSION as string

  await database()
  app.use(cors())
  app.use(helmet())
  app.use(compression())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(version, router)
  app.use(notFound)
  app.use(errorHandler)

  app.listen(port, () => {
    logger.info(`[${host}:${port}]`)
  })
}

bootstrap()
