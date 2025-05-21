import express, { NextFunction, Request, Response } from 'express'
import { db } from 'data-source'
import { Tag } from '@entities/tag'
import { OK, CREATED } from '@utils/http.status.code'
import NotFoundException from '@exceptions/not.found.exception'
import BadRequestException from '@exceptions/bad.request.exception'
import { validate } from '@middlewares/validation'
import { auth } from '@middlewares/authenticated'
import CreateTagRequest from '@requests/create.tag.request'
import UpdateTagRequest from '@requests/update.tag.request'
import { Not } from 'typeorm'

const router = express.Router()
const tagRepository = db.getRepository<Tag>(Tag)

router.get('/', auth(), async (req: Request, res: Response) => {
  const tags = await tagRepository.find()

  res.status(OK).json({ tags })
})

router.get('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  const tag = await tagRepository.findOne({ where: { id } })
  if (!tag) {
    return next(new NotFoundException(`Not found tag ${id}`))
  }

  res.status(OK).json({ tag })
})

router.post(
  '/',
  auth(),
  validate(CreateTagRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug, status } = req.validated as CreateTagRequest

    const slugExisting = await tagRepository.findOneBy({ slug })
    if (slugExisting) {
      return next(new BadRequestException(`${slug} has already existed.`))
    }
    const tag = tagRepository.create({ name, slug, status })
    await tagRepository.save(tag)

    res.status(CREATED).json({ message: 'success' })
  }
)

router.put(
  '/:id',
  auth(),
  validate(UpdateTagRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug, status } = req.validated as UpdateTagRequest
    const id = Number(req.params.id)

    const tag = await tagRepository.findOne({ where: { id } })
    if (!tag) {
      return next(new NotFoundException(`Not found tag ${id}`))
    }
    const slugExisting = await tagRepository.findOneBy({ id: Not(id), slug })
    if (slugExisting) {
      return next(new BadRequestException(`${slug} has already existed.`))
    }

    tag.name = name
    tag.slug = slug
    tag.status = status
    await tagRepository.save(tag)

    res.status(OK).json({ message: 'success' })
  }
)

router.delete('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  const tag = await tagRepository.findOne({ where: { id } })
  if (!tag) {
    return next(new NotFoundException(`Not found tag ${id}`))
  }
  await tagRepository.remove(tag)

  res.status(OK).json({ message: 'success' })
})

export default router
