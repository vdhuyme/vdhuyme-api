import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import { db } from 'data-source'
import { OK } from '@utils/http.status.code'
import { Category } from '@entities/category'
import { BASE_STATUS } from '@constants/base.status'
import { validate } from '@middlewares/validation'
import QueryFilterRequest from '@requests/query.filter.request'
import { Post } from '@entities/post'
import BadRequestException from '@exceptions/bad.request.exception'

const router = express.Router()
const categoryTreeRepository = db.getTreeRepository<Category>(Category)
const categoryRepository = db.getRepository<Category>(Category)
const postRepository = db.getRepository<Post>(Post)

router.get('/', async (req: Request, res: Response) => {
  const categories = await categoryRepository.find({
    where: { status: BASE_STATUS.PUBLISHED },
    order: { createdAt: 'DESC' }
  })

  res.status(OK).json({ categories })
})

router.get('/tree', async (req: Request, res: Response) => {
  const categories = (await categoryTreeRepository.findTrees({ relations: ['children'] })).filter(
    category => category.status === BASE_STATUS.PUBLISHED
  )

  res.status(OK).json({ categories })
})

router.get(
  '/:slug',
  validate(QueryFilterRequest, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params
    const { page, limit, query, sort } = req.validated as QueryFilterRequest
    const skip = (page - 1) * limit

    const category = await categoryRepository.findOne({
      where: { slug, status: BASE_STATUS.PUBLISHED }
    })
    if (!category) {
      return next(new BadRequestException(`Category with slug ${slug} not found.`))
    }
    const [posts, total] = await postRepository
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
      .where('category.id = :categoryId', { categoryId: category.id })
      .andWhere('post.status = :status', { status: BASE_STATUS.PUBLISHED })
      .andWhere(query ? 'LOWER(post.title) LIKE LOWER(:query)' : '1=1', {
        query: `%${query}%`
      })
      .orderBy('post.createdAt', sort)
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    res.status(OK).json({ category, posts, total })
  }
)

export default router
