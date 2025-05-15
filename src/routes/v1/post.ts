import { Category } from '@entities/category'
import { Post } from '@entities/post'
import BadRequestException from '@exceptions/bad.request.exception'
import { auth } from '@middlewares/authenticated'
import { validate } from '@middlewares/validation'
import CreatePostRequest from '@requests/create.post.request'
import UpdatePostRequest from '@requests/update.post.request'
import UpdatePostStatusRequest from '@requests/update.post.status.request'
import { CREATED, OK } from '@utils/http.status.code'
import { db } from 'data-source'
import express, { NextFunction, Request, Response } from 'express'
import { In } from 'typeorm'

const router = express.Router()

router.post('/', auth(), validate(CreatePostRequest), async (req: Request, res: Response) => {
  const { title, description, content, thumbnail, slug, categories } = req.body as CreatePostRequest
  const { userId } = req.auth

  const postRepository = db.getRepository<Post>(Post)
  const categoryRepository = db.getRepository<Category>(Category)

  const categoryEntities =
    categories && categories.length > 0
      ? await categoryRepository.find({ where: { id: In(categories) } })
      : []

  const post = postRepository.create({
    userId,
    title,
    description,
    content,
    thumbnail,
    slug,
    categories: categoryEntities
  })

  await postRepository.save(post)
  res.status(CREATED).json({ message: 'success' })
})

router.get('/', auth(), async (req: Request, res: Response) => {
  const postRepository = db.getRepository<Post>(Post)
  const posts = await postRepository.find({ order: { createdAt: 'DESC' } })

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
  validate(UpdatePostStatusRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)
    const { status } = req.body as UpdatePostStatusRequest

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
  validate(UpdatePostRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)
    const { title, description, content, thumbnail, slug, categories } =
      req.body as UpdatePostRequest
    const { userId } = req.auth

    const postRepository = db.getRepository<Post>(Post)
    const categoryRepository = db.getRepository<Category>(Category)

    const categoryEntities =
      categories && categories.length > 0
        ? await categoryRepository.find({ where: { id: In(categories) } })
        : []

    const post = await postRepository.findOne({ where: { id }, relations: ['categories'] })
    if (!post) {
      return next(new BadRequestException(`Not found post: ${id}`))
    }

    post.userId = userId
    post.title = title
    post.description = description
    post.content = content
    post.thumbnail = thumbnail
    post.slug = slug
    post.categories = categoryEntities
    await postRepository.save(post)

    res.status(OK).json({ message: 'success' })
  }
)

export default router
