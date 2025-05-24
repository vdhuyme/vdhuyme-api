import { Category } from '@entities/category'

export interface CategoriesWithTotal {
  categories: Category[] | []
  total: number | 0
}
