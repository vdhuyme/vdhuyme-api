import { BASE_STATUS } from '@constants/base.status'
import { Category } from '@entities/category'
import BadRequestException from '@exceptions/bad.request.exception'
import { CategoriesWithTotal } from '@interfaces/contracts/category.contract'
import { IPostRepository, PostsWithTotal } from '@interfaces/index'
import { ICategoryRepository } from '@interfaces/repositories/category.repository.interface'
import { ICategoryService } from '@interfaces/services/category.service.interface'
import CreateCategoryRequest from '@requests/create.category.request'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdateCategoryRequest from '@requests/update.category.request'
import { inject } from 'inversify'

export default class CategoryService implements ICategoryService {
  constructor(
    @inject('ICategoryRepository') private categoryRepository: ICategoryRepository,
    @inject('IPostRepository') private postRepository: IPostRepository
  ) {}

  async createCategory(data: CreateCategoryRequest): Promise<void> {
    await this.categoryRepository.createCategory(data)
  }

  async getCategory(slug: string): Promise<Category> {
    const category = await this.categoryRepository.getCategory(slug)
    if (!category) {
      throw new BadRequestException(`Not found category ${slug}`)
    }
    return category
  }

  async getCategories(options: QueryFilterRequest): Promise<CategoriesWithTotal> {
    return await this.categoryRepository.getCategories(options)
  }

  async updateCategory(slug: string, data: UpdateCategoryRequest): Promise<void> {
    const { parentId, ...rest } = data

    const category = await this.categoryRepository.getCategory(slug)
    if (!category) {
      throw new BadRequestException(`Not found category ${slug}`)
    }

    if (parentId === category.id) {
      throw new BadRequestException(`A category cannot be its own parent`)
    }

    if (!parentId) {
      return await this.categoryRepository.updateCategory(slug, { ...rest, parent: null })
    }

    const parent = await this.categoryRepository.getCategoryById(parentId)
    if (!parent) {
      throw new BadRequestException(`Parent category not found ${parentId}`)
    }

    return await this.categoryRepository.updateCategory(slug, { ...rest, parent })
  }

  async deleteCategory(slug: string): Promise<void> {
    const category = await this.categoryRepository.getCategory(slug)
    if (!category) {
      throw new BadRequestException(`Not found category ${slug}`)
    }
    await this.categoryRepository.deleteCategory(slug)
  }

  async getPublishedCategory(
    slug: string,
    options: QueryFilterPublishedPostRequest
  ): Promise<PostsWithTotal> {
    const category = await this.categoryRepository.getCategory(slug)
    if (!category || category.status !== BASE_STATUS.PUBLISHED) {
      throw new BadRequestException(`Not found category ${slug}`)
    }

    const { posts, total } = await this.postRepository.getPosts(options)
    return { posts, total }
  }

  async getPublishedCategories(options: QueryFilterRequest): Promise<CategoriesWithTotal> {
    return await this.categoryRepository.getPublishedCategories(options)
  }

  async getCategoryTrees(): Promise<Category[]> {
    return await this.categoryRepository.getCategoryTrees()
  }
}
