import { Category } from '@entities/category'
import { Post } from '@entities/post'
import { IPaginationResult, IQueryOptions } from '@repositories/contracts/base.repository.interface'
import { IBaseService } from '@services/contracts/base.service.interface'

export interface ICategoryWithPostsResponse {
  category: Category
  posts: Post[]
}

export interface ICategoryService extends IBaseService<Category> {
  getPublishedCategories(options: IQueryOptions<Category>): Promise<IPaginationResult<Category>>
  getPublishedCategory(id: string): Promise<ICategoryWithPostsResponse>
  getTrees(): Promise<Category[]>
}
