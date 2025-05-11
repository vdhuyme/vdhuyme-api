import 'dotenv/config'
import { database } from '@config/database'
import express from 'express'
import { errorHandler } from '@middlewares/error.handler'
import router from '@routes/v1'
import cors from 'cors'
import { notFound } from '@middlewares/not.found'

const app = express()
database()
app.use(cors())
app.use(express.json())
app.use(router)
app.use(notFound)
app.use(errorHandler)

const port: number = Number((process.env.PORT as string) || '3000')
app.listen(port, () => {
  console.log(`[http://localhost:${port}]`)
})
