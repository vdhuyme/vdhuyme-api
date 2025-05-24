import { Category } from '@entities/category'
import { CategoriesWithTotal } from '@interfaces/contracts/category.contract'
import QueryFilterRequest from '@requests/query.filter.request'

export interface ICategoryRepository {
  createCategory(data: Partial<Category>): Promise<void>
  getCategory(slug: string): Promise<Category | null>
  getCategoryById(id: number): Promise<Category | null>
  getCategories(options: QueryFilterRequest): Promise<CategoriesWithTotal>
  updateCategory(data: Partial<Category>): Promise<void>
  deleteCategory(slug: string): Promise<void>
  getPublishedCategories(options: QueryFilterRequest): Promise<CategoriesWithTotal>
  getCategoryTrees(): Promise<Category[]>
}
