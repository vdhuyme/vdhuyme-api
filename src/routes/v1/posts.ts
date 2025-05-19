import { Category } from '@entities/category'
import { Post } from '@entities/post'
import { User } from '@entities/user'
import BadRequestException from '@exceptions/bad.request.exception'
import { auth } from '@middlewares/authenticated'
import { validate } from '@middlewares/validation'
import CreatePostRequest from '@requests/create.post.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdatePostRequest from '@requests/update.post.request'
import UpdatePostStatusRequest from '@requests/update.post.status.request'
import { CREATED, OK } from '@utils/http.status.code'
import { db } from 'data-source'
import express, { NextFunction, Request, Response } from 'express'
import { In } from 'typeorm'

const router = express.Router()
const postRepository = db.getRepository<Post>(Post)
const categoryRepository = db.getRepository<Category>(Category)
const userRepository = db.getRepository<User>(User)

router.post(
  '/',
  auth(),
  validate(CreatePostRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, excerpt, content, thumbnail, slug, categories } =
      req.validated as CreatePostRequest
    const { userId } = req.auth

    const slugExisting = await postRepository.findOneBy({ slug })
    if (slugExisting) {
      return next(new BadRequestException(`${slug} has been already exist.`))
    }
    const categoryEntities =
      categories && categories.length > 0
        ? await categoryRepository.find({ where: { id: In(categories) } })
        : []

    const author = await userRepository.findOneByOrFail({ id: userId })
    const post = postRepository.create({
      author,
      title,
      excerpt,
      content,
      thumbnail,
      slug,
      categories: categoryEntities
    })

    await postRepository.save(post)
    res.status(CREATED).json({ message: 'success' })
  }
)

router.get(
  '/',
  auth(),
  validate(QueryFilterRequest, 'query'),
  async (req: Request, res: Response) => {
    const { page, limit, query, sort } = req.validated as QueryFilterRequest
    const skip = (page - 1) * limit

    const [posts, total] = await postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .andWhere(query ? 'LOWER(post.title) LIKE LOWER(:query)' : '1=1', {
        query: `%${query}%`
      })
      .orderBy('post.createdAt', sort)
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    res.status(OK).json({ posts, total })
  }
)

router.get('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  const post = await postRepository
    .createQueryBuilder('post')
    .leftJoin('post.categories', 'categories')
    .addSelect(['categories.id', 'categories.name'])
    .leftJoin('post.author', 'author')
    .addSelect(['author.id', 'author.name', 'author.email'])
    .where('post.id = :id', { id })
    .getOne()
  if (!post) {
    return next(new BadRequestException(`Not found post ${id}`))
  }

  res.status(OK).json({ post })
})

router.delete('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

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
    const { status } = req.validated as UpdatePostStatusRequest

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
    const { title, excerpt, content, thumbnail, slug, categories } =
      req.validated as UpdatePostRequest

    const categoryEntities =
      categories && categories.length > 0
        ? await categoryRepository.find({ where: { id: In(categories) } })
        : []
    const post = await postRepository.findOne({ where: { id }, relations: ['categories'] })
    if (!post) {
      return next(new BadRequestException(`Not found post: ${id}`))
    }

    post.title = title
    post.excerpt = excerpt
    post.content = content
    post.thumbnail = thumbnail
    post.slug = slug
    post.categories = categoryEntities
    await postRepository.save(post)

    res.status(OK).json({ message: 'success' })
  }
)

export default router
