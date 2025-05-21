import express, { Request, Response, NextFunction } from 'express'
import { db } from 'data-source'
import { Comment } from '@entities/comment'
import { Post } from '@entities/post'
import { CREATED, OK } from '@utils/http.status.code'
import { BASE_STATUS } from '@constants/base.status'
import { auth } from '@middlewares/authenticated'
import { validate } from '@middlewares/validation'
import CreateCommentRequest from '@requests/create.comment.request'
import { User } from '@entities/user'
import BadRequestException from '@exceptions/bad.request.exception'
import QueryFilterRequest from '@requests/query.filter.request'

const router = express.Router()
const commentRepository = db.getRepository<Comment>(Comment)
const postRepository = db.getRepository<Post>(Post)
const userRepository = db.getRepository<User>(User)

router.post(
  '/',
  auth(),
  validate(CreateCommentRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, content } = req.validated as CreateCommentRequest
    const { userId } = req.auth

    const post = await postRepository.findOne({
      where: { id: postId, status: BASE_STATUS.PUBLISHED }
    })
    if (!post) {
      return next(new BadRequestException(`Post with id ${postId} not found or unpublished.`))
    }
    const user = await userRepository.findOne({ where: { id: userId } })
    if (!user) {
      return next(new BadRequestException())
    }
    const comment = commentRepository.create({
      content,
      post,
      user
    })
    await commentRepository.save(comment)

    res.status(CREATED).json({ message: 'success' })
  }
)

router.get(
  '/',
  auth(),
  validate(QueryFilterRequest, 'query'),
  async (req: Request, res: Response) => {
    const { userId } = req.auth
    const { page, limit, query, sort } = req.validated as QueryFilterRequest
    const skip = (page - 1) * limit

    const [comments, total] = await commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.post', 'post')
      .where('comment.user_id = :userId', { userId })
      .andWhere(query ? 'LOWER(comment.content) LIKE LOWER(:query)' : '1=1', {
        query: `%${query}%`
      })
      .orderBy('comment.createdAt', sort)
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    res.status(OK).json({ comments, total })
  }
)

export default router
