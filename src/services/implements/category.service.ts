import { TYPES } from '@constants/types'
import { Category } from '@entities/category'
import { IQueryOptions, IPaginationResult } from '@repositories/contracts/base.repository.interface'
import { ICategoryRepository } from '@repositories/contracts/category.repository.interface'
import {
  ICategoryService,
  ICategoryWithPostsResponse
} from '@services/contracts/category.service.interface'
import BaseService from '@services/implements/base.service'
import { inject, injectable } from 'inversify'

@injectable()
export default class CategoryService extends BaseService<Category> implements ICategoryService {
  private categoryRepository: ICategoryRepository

  constructor(@inject(TYPES.CategoryRepository) categoryRepository: ICategoryRepository) {
    super(categoryRepository)
    this.categoryRepository = categoryRepository
  }

  async getTrees(): Promise<Category[]> {
    return this.categoryRepository.getTrees()
  }

  async getPublishedCategories(
    options: IQueryOptions<Category>
  ): Promise<IPaginationResult<Category>> {
    throw new Error('Method not implemented.')
  }

  async getPublishedCategory(id: string): Promise<ICategoryWithPostsResponse> {
    throw new Error('Method not implemented.')
  }
}
