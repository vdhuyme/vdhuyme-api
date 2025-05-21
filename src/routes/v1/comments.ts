import express, { NextFunction, Request, Response } from 'express'
import { db } from 'data-source'
import { Comment } from '@entities/comment'
import { OK } from '@utils/http.status.code'
import { auth } from '@middlewares/authenticated'
import { validate } from '@middlewares/validation'
import QueryFilterRequest from '@requests/query.filter.request'
import { Brackets } from 'typeorm'
import BadRequestException from '@exceptions/bad.request.exception'
import UpdateCommentStatusRequest from '@requests/update.comment.status.request'

const router = express.Router()
const commentRepository = db.getRepository<Comment>(Comment)

router.get(
  '/',
  auth(),
  validate(QueryFilterRequest, 'query'),
  async (req: Request, res: Response) => {
    const { page, limit, query, sort } = req.validated as QueryFilterRequest
    const skip = (page - 1) * limit

    const [comments, total] = await commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.post', 'post')
      .where(
        new Brackets(qb => {
          qb.where('LOWER(comment.content) LIKE LOWER(:query)', { query: `%${query}%` }).orWhere(
            'LOWER(post.title) LIKE LOWER(:query)',
            { query: `%${query}%` }
          )
        })
      )
      .orderBy('comment.createdAt', sort)
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    res.status(OK).json({ comments, total })
  }
)

router.delete('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  const comment = await commentRepository.findOne({ where: { id } })
  if (!comment) {
    return next(new BadRequestException(`Not found comment ${id}`))
  }
  await commentRepository.remove(comment)

  res.status(OK).json({ message: 'success' })
})

router.patch(
  '/:id',
  auth(),
  validate(UpdateCommentStatusRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)
    const { status } = req.validated as UpdateCommentStatusRequest

    const comment = await commentRepository.findOne({ where: { id } })
    if (!comment) {
      return next(new BadRequestException(`Not found comment: ${id}`))
    }
    comment.status = status
    await commentRepository.save(comment)

    res.status(OK).json({ message: 'success' })
  }
)

export default router
