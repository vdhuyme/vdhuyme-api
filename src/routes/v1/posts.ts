import { Category } from '@entities/category'
import { Post } from '@entities/post'
import { Tag } from '@entities/tag'
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
const userRepository = db.getRepository<User>(User)
const categoryRepository = db.getRepository<Category>(Category)
const tagRepository = db.getRepository<Tag>(Tag)

router.get(
  '/',
  auth(),
  validate(QueryFilterRequest, 'query'),
  async (req: Request, res: Response) => {
    const { page, limit, query, sort } = req.validated as QueryFilterRequest
    const skip = (page - 1) * limit

    const [posts, total] = await postRepository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.name', 'author.email'])
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
    .leftJoin('post.author', 'author')
    .addSelect(['author.id', 'author.name', 'author.email'])
    .leftJoinAndSelect('post.category', 'category')
    .leftJoinAndSelect('post.tags', 'tags')
    .where('post.id = :id', { id })
    .getOne()
  if (!post) {
    return next(new BadRequestException(`Not found post ${id}`))
  }

  res.status(OK).json({ post })
})

router.post(
  '/',
  auth(),
  validate(CreatePostRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, excerpt, content, thumbnail, slug, tagIds, readTime, categoryId } =
      req.validated as CreatePostRequest
    const { userId } = req.auth

    const slugExisting = await postRepository.findOneBy({ slug })
    if (slugExisting) {
      return next(new BadRequestException(`${slug} has been already exist.`))
    }
    const author = await userRepository.findOneByOrFail({ id: userId })
    const category = await categoryRepository.findOneByOrFail({ id: categoryId })
    const tags = await tagRepository.find({ where: { id: In(tagIds) } })
    const post = postRepository.create({
      author,
      title,
      excerpt,
      content,
      thumbnail,
      slug,
      readTime,
      category,
      tags
    })

    await postRepository.save(post)
    res.status(CREATED).json({ message: 'success' })
  }
)

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
    const { title, excerpt, content, thumbnail, slug, categoryId, tagIds, readTime } =
      req.validated as UpdatePostRequest

    const post = await postRepository.findOne({ where: { id } })
    if (!post) {
      return next(new BadRequestException(`Not found post: ${id}`))
    }
    const category = await categoryRepository.findOneByOrFail({ id: categoryId })
    const tags = await tagRepository.find({ where: { id: In(tagIds) } })
    post.title = title
    post.excerpt = excerpt
    post.content = content
    post.thumbnail = thumbnail
    post.slug = slug
    post.category = category
    post.tags = tags
    post.readTime = readTime
    await postRepository.save(post)

    res.status(OK).json({ message: 'success' })
  }
)

export default router
