import 'dotenv/config'
import 'reflect-metadata'
import express, { Application } from 'express'
import { errorHandler } from '@middlewares/error.handler'
import router from '@routes/v1'
import cors from 'cors'
import { notFound } from '@middlewares/not.found'
import view from '@config/view'
import logger from '@config/logging'
import { database } from 'data-source'

const app: Application = express()

async function bootstrap() {
  await database()
  view(app)
  app.use(cors())
  app.use(express.json())
  app.use('/v1', router)
  app.use(notFound)
  app.use(errorHandler)

  const port: number = Number((process.env.PORT as string) || '3000')
  app.listen(port, () => {
    logger.info(`[http://localhost:${port}]`)
  })
}

bootstrap()
