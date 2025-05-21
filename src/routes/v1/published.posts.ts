import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import { db } from 'data-source'
import { Post } from '@entities/post'
import { BASE_STATUS } from '@constants/base.status'
import QueryFilterRequest from '@requests/query.filter.request'
import { validate } from '@middlewares/validation'
import { OK } from '@utils/http.status.code'
import NotFoundException from '@exceptions/not.found.exception'

const router = express.Router()
const postRepository = db.getRepository<Post>(Post)

router.get('/', validate(QueryFilterRequest, 'query'), async (req: Request, res: Response) => {
  const { page, limit, query, sort } = req.validated as QueryFilterRequest
  const skip = (page - 1) * limit

  const [posts, total] = await postRepository
    .createQueryBuilder('post')
    .where('post.status = :status', { status: BASE_STATUS.PUBLISHED })
    .andWhere(query ? 'LOWER(post.title) LIKE LOWER(:query)' : '1=1', { query: `%${query}%` })
    .orderBy('post.createdAt', sort)
    .skip(skip)
    .take(limit)
    .getManyAndCount()

  res.status(OK).json({ posts, total })
})

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params

  const post = await postRepository
    .createQueryBuilder('post')
    .leftJoin('post.author', 'author')
    .addSelect(['author.name', 'author.email'])
    .where('post.slug = :slug', { slug })
    .andWhere('post.status = :status', { status: BASE_STATUS.PUBLISHED })
    .getOne()
  if (!post) {
    return next(new NotFoundException(`Not found post ${slug}`))
  }

  res.status(OK).json({ post })
})

export default router
