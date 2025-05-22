import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import { db } from 'data-source'
import { Post } from '@entities/post'
import { BASE_STATUS } from '@constants/base.status'
import { validate } from '@middlewares/validation'
import { OK } from '@utils/http.status.code'
import BadRequestException from '@exceptions/bad.request.exception'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'

const router = express.Router()
const postRepository = db.getRepository<Post>(Post)

router.get(
  '/',
  validate(QueryFilterPublishedPostRequest, 'query'),
  async (req: Request, res: Response) => {
    const { page, limit, query, sort, categoryId } =
      req.validated as QueryFilterPublishedPostRequest
    const skip = (page - 1) * limit

    const queryBuilder = postRepository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect([
        'author.id',
        'author.name',
        'author.email',
        'author.phoneNumber',
        'author.avatar'
      ])
      .leftJoinAndSelect('post.category', 'category')
      .where('post.status = :status', { status: BASE_STATUS.PUBLISHED })
    if (query) {
      queryBuilder.andWhere('LOWER(post.title) LIKE LOWER(:query)', { query: `%${query}%` })
    }
    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId })
    }
    const [posts, total] = await queryBuilder
      .orderBy('post.createdAt', sort)
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    res.status(OK).json({ posts, total })
  }
)

router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params

  const post = await postRepository
    .createQueryBuilder('post')
    .leftJoin('post.author', 'author')
    .addSelect(['author.id', 'author.name', 'author.email', 'author.phoneNumber', 'author.avatar'])
    .leftJoinAndSelect('post.category', 'category')
    .leftJoinAndSelect('post.tags', 'tags')
    .where('post.slug = :slug', { slug })
    .andWhere('post.status = :status', { status: BASE_STATUS.PUBLISHED })
    .getOne()
  if (!post) {
    return next(new BadRequestException(`Not found post ${slug}`))
  }

  res.status(OK).json({ post })
})

router.get('/related/:slug', async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params

  const post = await postRepository.findOne({ where: { slug }, relations: ['category'] })
  if (!post) {
    return next(new BadRequestException('Post not found'))
  }
  const relatedPosts = await postRepository
    .createQueryBuilder('post')
    .leftJoin('post.category', 'category')
    .leftJoin('post.tags', 'tag')
    .where('post.status = :status', { status: BASE_STATUS.PUBLISHED })
    .andWhere('post.id != :id', { id: post.id })
    .groupBy('post.id')
    .addGroupBy('category.id')
    .addSelect(['category.id', 'category.name', 'category.slug'])
    .orderBy('post.createdAt', 'DESC')
    .distinct(true)
    .take(10)
    .getMany()

  res.status(OK).json({ relatedPosts })
})

export default router
