import { TYPES } from '@constants/types'
import { Category } from '@entities/category'
import { ICategoryRepository } from '@repositories/contracts/category.repository.interface'
import BaseRepository from '@repositories/implements/base.repository'
import { inject } from 'inversify'
import { DataSource } from 'typeorm'

export default class CategoryRepository
  extends BaseRepository<Category>
  implements ICategoryRepository
{
  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    super(Category, dataSource)
  }

  async findTrees(): Promise<Category[]> {
    return this.treeRepository.findTrees({ relations: ['children'] })
  }
}
