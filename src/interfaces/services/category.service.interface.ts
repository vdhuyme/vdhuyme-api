import { Category } from '@entities/category'
import { CategoriesWithTotal } from '@interfaces/contracts/category.contract'
import { PostsWithTotal } from '@interfaces/contracts/post.contract'
import CreateCategoryRequest from '@requests/create.category.request'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdateCategoryRequest from '@requests/update.category.request'

export interface ICategoryService {
  createCategory(data: CreateCategoryRequest): Promise<void>
  getCategory(slug: string): Promise<Category>
  getCategories(options: QueryFilterRequest): Promise<CategoriesWithTotal>
  updateCategory(slug: string, data: UpdateCategoryRequest): Promise<void>
  deleteCategory(slug: string): Promise<void>
  getPublishedCategory(
    slug: string,
    options: QueryFilterPublishedPostRequest
  ): Promise<PostsWithTotal>
  getPublishedCategories(options: QueryFilterRequest): Promise<CategoriesWithTotal>
  getCategoryTrees(): Promise<Category[]>
}
