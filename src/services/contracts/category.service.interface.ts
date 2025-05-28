import { Category } from '@entities/category'
import { IPaginationResult, IQueryOptions } from '@repositories/contracts/base.repository.interface'
import { IBaseService } from '@services/contracts/base.service.interface'
import { DeepPartial } from 'typeorm'

export interface ICategoryService extends IBaseService<Category> {
  getPublishedCategories(options: IQueryOptions<Category>): Promise<IPaginationResult<Category>>
  getPublishedCategory(id: string | number, options?: IQueryOptions<Category>): Promise<Category>
  getTrees(): Promise<Category[]>
  store(ancestorId: string | number, data: DeepPartial<Category>): Promise<Category>
}
