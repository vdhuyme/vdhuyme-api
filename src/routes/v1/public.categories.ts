import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import { db } from 'data-source'
import { OK } from '@utils/http.status.code'
import NotFoundException from '@exceptions/not.found.exception'
import { Category } from '@entities/category'
import BaseStatusEnum from '@enums/base.status.enum'
import QueryFilterRequest from '@requests/query.filter.request'
import { validate } from '@middlewares/validation'
import { Post } from '@entities/post'

const router = express.Router()
const categoryRepository = db.getTreeRepository<Category>(Category)
const postRepository = db.getRepository<Post>(Post)

router.get('/', async (req: Request, res: Response) => {
  const categories = await categoryRepository.findTrees({ relations: ['children'] })

  res.status(OK).json({ categories })
})

router.get(
  '/:slug',
  validate(QueryFilterRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params
    const { limit } = req.validated as QueryFilterRequest

    const categoryQuery = categoryRepository
      .createQueryBuilder('category')
      .where('category.slug = :slug', { slug })
      .andWhere('category.status = :status', { status: BaseStatusEnum.PUBLISHED })
    const category = await categoryQuery.getOne()
    if (!category) {
      return next(new NotFoundException(`Not found category ${slug}`))
    }
    const posts = await postRepository
      .createQueryBuilder('post')
      .innerJoin('post.categories', 'cat', 'cat.id = :catId', { catId: category.id })
      .where('post.status = :status', { status: BaseStatusEnum.PUBLISHED })
      .orderBy('post.createdAt', 'DESC')
      .take(limit)
      .getMany()
    category.posts = posts

    res.status(OK).json({ category })
  }
)
export default router
