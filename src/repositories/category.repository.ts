import { BASE_STATUS } from '@constants/base.status'
import { Category } from '@entities/category'
import { CategoriesWithTotal } from '@interfaces/contracts/category.contract'
import { ICategoryRepository } from '@interfaces/repositories/category.repository.interface'
import QueryFilterRequest from '@requests/query.filter.request'
import { ds } from 'data-source'
import { Repository, TreeRepository } from 'typeorm'

export default class CategoryRepository implements ICategoryRepository {
  repository: Repository<Category>
  treeRepository: TreeRepository<Category>

  constructor() {
    this.repository = ds.getRepository<Category>(Category)
    this.treeRepository = ds.getTreeRepository<Category>(Category)
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.repository.findOne({ where: { id } })
  }

  async createCategory(data: Partial<Category>): Promise<void> {
    const category = this.repository.create(data)
    await this.repository.save(category)
  }

  async getCategory(slug: string): Promise<Category | null> {
    return await this.repository.findOne({ where: { slug } })
  }

  async getCategories(options: QueryFilterRequest): Promise<CategoriesWithTotal> {
    const { page, limit, query, sort } = options
    const skip = (page - 1) * limit

    const queryBuilder = this.repository.createQueryBuilder('category')

    if (query) {
      queryBuilder.andWhere('LOWER(category.name) LIKE LOWER(:query)', {
        query: `%${query}%`
      })
    }

    const [categories, total] = await queryBuilder
      // .orderBy('category.createdAt', sort)
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    return { categories, total }
  }

  async updateCategory(data: Partial<Category>): Promise<void> {
    await this.repository.save(data)
  }

  async deleteCategory(slug: string): Promise<void> {
    await this.repository.delete({ slug })
  }

  async getPublishedCategories(options: QueryFilterRequest): Promise<CategoriesWithTotal> {
    const { page, limit, query, sort } = options
    const skip = (page - 1) * limit

    const queryBuilder = this.repository
      .createQueryBuilder('category')
      .where('category.status = :status', { status: BASE_STATUS.PUBLISHED })

    if (query) {
      queryBuilder.andWhere('LOWER(category.name) LIKE LOWER(:query)', { query: `%${query}%` })
    }

    // queryBuilder.orderBy('category.createdAt', sort).skip(skip).take(limit)

    const [categories, total] = await queryBuilder.getManyAndCount()

    return { categories, total }
  }

  async getCategoryTrees(): Promise<Category[]> {
    return await this.treeRepository.findTrees({ relations: ['children'] })
  }
}
