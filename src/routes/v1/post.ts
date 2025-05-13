import { db, Post } from '@config/database'
import BaseStatusEnum from '@enums/base.status.enum'
import BadRequestException from '@exceptions/bad.request.exception'
import { auth } from '@middlewares/authenticated'
import { validate } from '@middlewares/validation'
import { createPostRequest } from '@requests/create.post.request'
import { updatePostRequest } from '@requests/update.post.request'
import { updatePostStatusRequest } from '@requests/update.post.status.request'
import { CREATED, OK } from '@utils/http.status.code'
import { id } from '@utils/id'
import { timestamp } from '@utils/timestamp'
import express, { NextFunction, Request, Response } from 'express'

const router = express.Router()

router.post('/', auth(), validate(createPostRequest), async (req: Request, res: Response) => {
  const { title, content, description, images, thumbnail } = req.body
  const post: Post = {
    id: id(),
    title,
    description,
    content,
    images,
    thumbnail,
    status: BaseStatusEnum.PUBLISHED,
    createdAt: timestamp(),
    updatedAt: timestamp()
  }
  db.data.posts.push(post)
  await db.write()
  res.status(CREATED).json({ message: 'success' })
})

router.get('/', auth(), (req: Request, res: Response) => {
  const posts = db.data.posts
  res.status(OK).json({ posts })
})

router.delete('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const post = db.data.posts.find((post) => post.id === id)
  if (!post) {
    return next(new BadRequestException(`Not found post: ${id}`))
  }
  db.data.posts = db.data.posts.filter((post) => post.id !== id)
  await db.write()
  res.status(OK).json({ message: 'success' })
})

router.patch(
  '/:id',
  auth(),
  validate(updatePostStatusRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { status } = req.body
    const post = db.data.posts.find((post) => post.id === id)
    if (!post) {
      return next(new BadRequestException(`Not found post: ${id}`))
    }

    post.status = status
    post.updatedAt = timestamp()
    await db.write()
    res.status(OK).json({ message: 'success' })
  }
)

router.put(
  '/:id',
  auth(),
  validate(updatePostRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { title, content, description, status } = req.body
    const post = db.data.posts.find((post) => post.id === id)
    if (!post) {
      return next(new BadRequestException(`Not found post: ${id}`))
    }

    post.title = title
    post.content = content
    post.description = description
    post.status = status
    post.updatedAt = timestamp()
    await db.write()
    res.status(OK).json({ message: 'success' })
  }
)

export default router
