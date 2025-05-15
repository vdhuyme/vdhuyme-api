import express, { Request, Response } from 'express'
import { OK } from '@utils/http.status.code'
import BaseStatusEnum from '@enums/base.status.enum'
import { Post } from '@entities/post'
import { db } from 'data-source'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const postRepository = db.getRepository<Post>(Post)
  const posts = await postRepository.find({
    where: { status: BaseStatusEnum.PUBLISHED },
    order: { createdAt: 'DESC' }
  })

  res.status(OK).json({ posts })
})

export default router
