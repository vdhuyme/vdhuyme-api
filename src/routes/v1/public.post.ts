import express, { Request, Response } from 'express'
import { OK } from '@utils/http.status.code'
import { db } from '@config/database'
import BaseStatusEnum from '@enums/base.status.enum'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const posts = db.data.posts.filter((p) => p.status === BaseStatusEnum.PUBLISHED)
  res.status(OK).json({ posts })
})

export default router
