import express, { NextFunction, Request, Response } from 'express'
import { db } from 'data-source'
import { Category } from '@entities/category'
import { OK, CREATED } from '@utils/http.status.code'
import { validate } from '@middlewares/validation'
import CreateCategoryRequest from '@requests/create.category.request'
import UpdateCategoryRequest from '@requests/update.category.request'
import { auth } from '@middlewares/authenticated'
import BadRequestException from '@exceptions/bad.request.exception'
import { Not } from 'typeorm'

const router = express.Router()
const categoryRepository = db.getTreeRepository<Category>(Category)

router.get('/', auth(), async (req: Request, res: Response) => {
  const categories = await categoryRepository.findTrees()

  res.status(OK).json({ categories })
})

router.get('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10)

  const category = await categoryRepository.findOne({
    where: { id },
    relations: ['parent', 'children']
  })
  if (!category) {
    return next(new BadRequestException(`Not found category ${id}`))
  }

  res.status(OK).json({ category })
})

router.post(
  '/',
  auth(),
  validate(CreateCategoryRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug, description, parentId, icon, thumbnail } =
      req.validated as CreateCategoryRequest

    const slugExisting = await categoryRepository.findOneBy({ slug })
    if (slugExisting) {
      return next(new BadRequestException(`${slug} has been already exist.`))
    }
    const category = new Category()
    category.name = name
    category.slug = slug
    category.description = description
    category.icon = icon
    category.thumbnail = thumbnail
    category.parent = parentId
      ? await categoryRepository.findOne({ where: { id: parentId } })
      : null
    await categoryRepository.save(category)

    res.status(CREATED).json({ message: 'success' })
  }
)

router.put(
  '/:id',
  auth(),
  validate(UpdateCategoryRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug, description, parentId, icon, thumbnail, status } =
      req.validated as UpdateCategoryRequest
    const id = parseInt(req.params.id, 10)

    const category = await categoryRepository.findOne({ where: { id } })
    if (!category) {
      return next(new BadRequestException(`Not found category ${id}`))
    }
    const slugExisting = await categoryRepository.findOneBy({ id: Not(id), slug })
    if (slugExisting) {
      return next(new BadRequestException(`${slug} has been already exist.`))
    }
    category.name = name
    category.slug = slug
    category.status = status
    category.description = description
    category.icon = icon
    category.thumbnail = thumbnail
    category.parent = parentId
      ? await categoryRepository.findOne({ where: { id: parentId } })
      : null
    await categoryRepository.save(category)

    res.status(OK).json({ message: 'success' })
  }
)

router.delete('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10)

  const category = await categoryRepository.findOne({ where: { id } })
  if (!category) {
    return next(new BadRequestException(`Not found category ${id}`))
  }
  await categoryRepository.remove(category)

  res.status(OK).json({ message: 'success' })
})

export default router
