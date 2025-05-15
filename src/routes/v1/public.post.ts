import express from 'express'
import { Request, Response } from 'express'
import { db } from 'data-source'
import { Post } from '@entities/post'
import BaseStatusEnum from '@enums/base.status.enum'
import FilterPostRequest from '@requests/filter.post.request'
import { validate } from '@middlewares/validation'
import { OK } from '@utils/http.status.code'

const router = express.Router()

router.get('/', validate(FilterPostRequest, 'query'), async (req: Request, res: Response) => {
  const { page, limit, query, sort } = req.validated as FilterPostRequest

  const skip = (page - 1) * limit
  const postRepository = db.getRepository<Post>(Post)
  const builder = postRepository
    .createQueryBuilder('post')
    .where('post.status = :status', { status: BaseStatusEnum.PUBLISHED })
  query && builder.andWhere('post.title LIKE :query COLLATE NOCASE', { query: `%${query}%` })
  const posts = await builder.orderBy('post.created_at', sort).skip(skip).take(limit).getMany()

  res.status(OK).json({ posts })
})

export default router
