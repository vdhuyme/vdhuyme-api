import 'dotenv/config'
import { database } from '@config/database'
import express, { Application } from 'express'
import { errorHandler } from '@middlewares/error.handler'
import router from '@routes/v1'
import cors from 'cors'
import { notFound } from '@middlewares/not.found'
import view from '@config/view'
import logger from '@config/logging'

const app: Application = express()
database()
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
