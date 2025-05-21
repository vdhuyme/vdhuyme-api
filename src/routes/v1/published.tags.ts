import express, { NextFunction, Request, Response } from 'express'
import { db } from 'data-source'
import { OK } from '@utils/http.status.code'
import { Tag } from '@entities/tag'
import { Post } from '@entities/post'
import { BASE_STATUS } from '@constants/base.status'
import NotFoundException from '@exceptions/not.found.exception'
import { validate } from '@middlewares/validation'
import QueryFilterRequest from '@requests/query.filter.request'

const router = express.Router()
const tagRepository = db.getRepository(Tag)

router.get('/', async (_req: Request, res: Response) => {
  const tags = await tagRepository.find({
    where: { status: BASE_STATUS.PUBLISHED },
    order: { createdAt: 'DESC' }
  })

  res.status(OK).json({ tags })
})

router.get(
  '/:slug',
  validate(QueryFilterRequest, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params
    const { page, limit, query, sort } = req.validated as QueryFilterRequest
    const skip = (page - 1) * limit

    const tag = await tagRepository.findOne({
      where: { slug, status: BASE_STATUS.PUBLISHED }
    })

    if (!tag) {
      return next(new NotFoundException(`Tag with slug ${slug} not found.`))
    }

    const postRepository = db.getRepository(Post)
    const [posts, total] = await postRepository
      .createQueryBuilder('post')
      .leftJoin('post.tags', 'tag')
      .leftJoin('post.author', 'author')
      .addSelect([
        'author.id',
        'author.name',
        'author.email',
        'author.phoneNumber',
        'author.avatar'
      ])
      .leftJoinAndSelect('post.category', 'category')
      .where('tag.id = :tagId', { tagId: tag.id })
      .andWhere('post.status = :status', { status: BASE_STATUS.PUBLISHED })
      .andWhere(query ? 'LOWER(post.title) LIKE LOWER(:query)' : '1=1', {
        query: `%${query}%`
      })
      .orderBy('post.createdAt', sort)
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    res.status(OK).json({ tag, posts, total })
  }
)

export default router
