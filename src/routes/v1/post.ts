import { Post } from '@entities/post'
import BaseStatusEnum from '@enums/base.status.enum'
import BadRequestException from '@exceptions/bad.request.exception'
import { auth } from '@middlewares/authenticated'
import { validate } from '@middlewares/validation'
import { createPostRequest } from '@requests/create.post.request'
import { updatePostRequest } from '@requests/update.post.request'
import { updatePostStatusRequest } from '@requests/update.post.status.request'
import { CREATED, OK } from '@utils/http.status.code'
import { db } from 'data-source'
import express, { NextFunction, Request, Response } from 'express'

const router = express.Router()

router.post('/', auth(), validate(createPostRequest), async (req: Request, res: Response) => {
  const { title, content, description, images, thumbnail } = req.body

  const postRepository = db.getRepository<Post>(Post)
  const post = postRepository.create({
    title,
    description,
    content,
    images,
    thumbnail,
    status: BaseStatusEnum.PUBLISHED
  })

  await postRepository.save(post)
  res.status(CREATED).json({ message: 'success' })
})

router.get('/', auth(), async (req: Request, res: Response) => {
  const postRepository = db.getRepository<Post>(Post)
  const posts = await postRepository.find({ order: { created_at: 'DESC' } })

  res.status(OK).json({ posts })
})

router.delete('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  const postRepository = db.getRepository<Post>(Post)
  const post = await postRepository.findOne({ where: { id } })
  if (!post) {
    return next(new BadRequestException(`Not found post: ${id}`))
  }

  await postRepository.remove(post)
  res.status(OK).json({ message: 'success' })
})

router.patch(
  '/:id',
  auth(),
  validate(updatePostStatusRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)
    const { status } = req.body

    const postRepository = db.getRepository(Post)
    const post = await postRepository.findOne({ where: { id } })
    if (!post) {
      return next(new BadRequestException(`Not found post: ${id}`))
    }
    post.status = status
    await postRepository.save(post)

    res.status(OK).json({ message: 'success' })
  }
)

router.put(
  '/:id',
  auth(),
  validate(updatePostRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)
    const { title, description, thumbnail, images, content } = req.body

    const postRepository = db.getRepository(Post)
    const post = await postRepository.findOne({ where: { id } })
    if (!post) {
      return next(new BadRequestException(`Not found post: ${id}`))
    }
    post.title = title
    post.content = content
    post.description = description
    post.thumbnail = thumbnail
    post.images = images
    await postRepository.save(post)

    res.status(OK).json({ message: 'success' })
  }
)

export default router
