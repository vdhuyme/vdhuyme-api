import express, { NextFunction, Request, Response } from 'express'
import { db } from 'data-source'
import { Category } from '@entities/category'
import { OK, CREATED } from '@utils/http.status.code'
import NotFoundException from '@exceptions/not.found.exception'
import { validate } from '@middlewares/validation'
import CreateCategoryRequest from '@requests/create.category.request'
import UpdateCategoryRequest from '@requests/update.category.request'
import { auth } from '@middlewares/authenticated'
import BadRequestException from '@exceptions/bad.request.exception'

const router = express.Router()
const categoryRepository = db.getTreeRepository<Category>(Category)

router.get('/', auth(), async (req: Request, res: Response) => {
  const categories = await categoryRepository.findTrees({ relations: ['children'] })

  res.status(OK).json({ categories })
})

router.get('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  const category = await categoryRepository.findOne({
    where: { id },
    relations: ['parent', 'children']
  })
  if (!category) {
    return next(new NotFoundException(`Not found category ${id}`))
  }

  res.status(OK).json({ category })
})

router.post(
  '/',
  auth(),
  validate(CreateCategoryRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug, description, parentId } = req.validated

    const slugExisting = await categoryRepository.findOneBy({ slug })
    if (slugExisting) {
      return next(new BadRequestException(`${slug} has been already exist.`))
    }
    const category = new Category()
    category.name = name
    category.slug = slug
    category.description = description
    const parent = await categoryRepository.findOne({ where: { id: parentId } })
    category.parent = parent as Category
    await categoryRepository.save(category)

    res.status(CREATED).json({ message: 'success' })
  }
)

router.put(
  '/:id',
  auth(),
  validate(UpdateCategoryRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug, description, parentId } = req.validated as UpdateCategoryRequest
    const id = Number(req.params.id)

    const category = await categoryRepository.findOne({ where: { id } })
    if (!category) {
      return next(new NotFoundException(`Not found category ${id}`))
    }
    category.name = name
    category.slug = slug
    category.description = description
    const parent = !parentId
      ? null
      : await categoryRepository.findOne({ where: { id: Number(parentId) } })
    category.parent = parent
    await categoryRepository.save(category)

    res.status(OK).json({ message: 'success' })
  }
)

router.delete('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  const category = await categoryRepository.findOne({ where: { id } })
  if (!category) {
    return next(new NotFoundException(`Not found category ${id}`))
  }
  await categoryRepository.remove(category)

  res.status(OK).json({ message: 'success' })
})

export default router
