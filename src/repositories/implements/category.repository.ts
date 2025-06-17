import { TYPES } from '@constants/types'
import { Category } from '@entities/category'
import { ICategoryRepository } from '@repositories/contracts/category.repository.interface'
import BaseRepository from '@repositories/implements/base.repository'
import { inject } from 'inversify'
import { DataSource, TreeRepository } from 'typeorm'

export default class CategoryRepository
  extends BaseRepository<Category>
  implements ICategoryRepository
{
  private treeRepository: TreeRepository<Category>

  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    super(Category, dataSource)
    this.treeRepository = dataSource.getTreeRepository(Category)
  }

  async getTrees(): Promise<Category[]> {
    return await this.treeRepository.findTrees()
  }
}
