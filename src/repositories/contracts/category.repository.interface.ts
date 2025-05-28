import { Category } from '@entities/category'
import { IBaseRepository } from '@repositories/contracts/base.repository.interface'

export interface ICategoryRepository extends IBaseRepository<Category> {
  findTrees(): Promise<Category[]>
}
