import 'dotenv/config'
import 'reflect-metadata'
import '@controllers/index'
import express from 'express'
import { errorHandler } from '@middlewares/error.handler'
import cors from 'cors'
import { notFound } from '@middlewares/not.found'
import logger from '@config/logging'
import { database } from 'data-source'
import helmet from 'helmet'
import compression from 'compression'
import { InversifyExpressServer } from 'inversify-express-utils'
import { container } from 'inversify-config'

async function bootstrap(): Promise<void> {
  await database()

  const server = new InversifyExpressServer(container)

  server.setConfig(app => {
    app.use(cors())
    app.use(helmet())
    app.use(compression())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
  })

  server.setErrorConfig(app => {
    app.use(notFound)
    app.use(errorHandler)
  })

  const app = server.build()
  const port = parseInt(process.env.PORT as string)
  const host = process.env.APP_URL as string

  app.listen(port, () => {
    logger.info(`[${host}:${port}]`)
  })
}

bootstrap()
