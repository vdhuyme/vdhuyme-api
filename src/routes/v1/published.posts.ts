import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import { db } from 'data-source'
import { Post } from '@entities/post'
import { BASE_STATUS } from '@constants/base.status'
import QueryFilterRequest from '@requests/query.filter.request'
import { validate } from '@middlewares/validation'
import { OK } from '@utils/http.status.code'
import BadRequestException from '@exceptions/bad.request.exception'

const router = express.Router()
const postRepository = db.getRepository<Post>(Post)

router.get('/', validate(QueryFilterRequest, 'query'), async (req: Request, res: Response) => {
  const { page, limit, query, sort } = req.validated as QueryFilterRequest
  const skip = (page - 1) * limit

  const [posts, total] = await postRepository
    .createQueryBuilder('post')
    .leftJoin('post.author', 'author')
    .addSelect(['author.id', 'author.name', 'author.email', 'author.phoneNumber', 'author.avatar'])
    .leftJoinAndSelect('post.category', 'category')
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

  const post = await postRepository.findOne({
    where: { slug },
    relations: ['category', 'tags']
  })
  if (!post) {
    return next(new BadRequestException('Post not found'))
  }
  const tagIds = post.tags.map(t => t.id)
  const relatedPosts = await postRepository
    .createQueryBuilder('post')
    .leftJoin('post.category', 'category')
    .where('post.status = :status', { status: BASE_STATUS.PUBLISHED })
    .leftJoin('post.tags', 'tag')
    .where('tag.id IN (:...tagIds)', { tagIds })
    .andWhere('post.id != :id', { id: post.id })
    .groupBy('post.id')
    .addGroupBy('category.id')
    .addSelect('category.id')
    .addSelect('category.name')
    .addSelect('category.slug')
    .orderBy('post.createdAt', 'DESC')
    .distinct(true)
    .take(10)
    .getMany()

  res.status(OK).json({ relatedPosts })
})

export default router
