import { OK } from '@utils/http.status.code'
import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
  res.status(OK).json({
    uptime: process.uptime(),
    timestamp: Date.now()
  })
})

export default router
