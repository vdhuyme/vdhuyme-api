import express from 'express'
import { Request, Response } from 'express'
import { db } from 'data-source'
import { OK } from '@utils/http.status.code'
import { Category } from '@entities/category'

const router = express.Router()
const categoryRepository = db.getTreeRepository<Category>(Category)

router.get('/', async (req: Request, res: Response) => {
  const categories = await categoryRepository.findTrees({ relations: ['children'] })

  res.status(OK).json({ categories })
})

export default router
