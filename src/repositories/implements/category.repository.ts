import { Category } from '@entities/category'
import { ICategoryRepository } from '@repositories/contracts/category.repository.interface'
import BaseRepository from '@repositories/implements/base.repository'
import { dataSource } from 'data-source'
import { TreeRepository } from 'typeorm'

export default class CategoryRepository
  extends BaseRepository<Category>
  implements ICategoryRepository
{
  private treeRepository: TreeRepository<Category>

  constructor() {
    super(Category, dataSource)
    this.treeRepository = dataSource.getTreeRepository(Category)
  }

  async getTrees(): Promise<Category[]> {
    return this.treeRepository.findTrees()
  }
}
