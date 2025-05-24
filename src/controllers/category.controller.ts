import { NextFunction, Request, Response } from 'express'
import { inject } from 'inversify'
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  next,
  request,
  response
} from 'inversify-express-utils'
import { authenticate } from '@decorators/authenticate'
import QueryFilterRequest from '@requests/query.filter.request'
import { body } from '@decorators/validate.body.decorator'
import { query } from '@decorators/validate.query.decorator'
import { ICategoryService } from '@interfaces/services/category.service.interface'
import CreateCategoryRequest from '@requests/create.category.request'
import UpdateCategoryRequest from '@requests/update.category.request'
import { CREATED, OK } from '@utils/http.status.code'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'

@controller('/categories')
export default class CategoryController {
  constructor(@inject('ICategoryService') private categoryService: ICategoryService) {}

  @httpGet('/')
  @authenticate()
  @query(QueryFilterRequest)
  async getCategories(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const query = req.validated as QueryFilterRequest

    try {
      const result = await this.categoryService.getCategories(query)
      res.status(OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/trees')
  @authenticate()
  async getTrees(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    try {
      const result = await this.categoryService.getCategoryTrees()
      res.status(OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/:slug/detail')
  @authenticate()
  async getCategory(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const slug = req.params.slug as string

    try {
      const category = await this.categoryService.getCategory(slug)
      res.status(OK).json(category)
    } catch (error) {
      next(error)
    }
  }

  @httpPost('/')
  @authenticate()
  @body(CreateCategoryRequest)
  async createCategory(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const body = req.body as CreateCategoryRequest

    try {
      await this.categoryService.createCategory(body)
      res.status(CREATED).json({ message: 'success' })
    } catch (error) {
      next(error)
    }
  }

  @httpPut('/:slug')
  @authenticate()
  @body(UpdateCategoryRequest)
  async updateCategory(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const body = req.body as UpdateCategoryRequest
    const slug = req.params.slug as string

    try {
      await this.categoryService.updateCategory(slug, body)
      res.status(OK).json({ message: 'success' })
    } catch (error) {
      next(error)
    }
  }

  @httpDelete('/:slug')
  @authenticate()
  async deleteCategory(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const slug = req.params.slug as string

    try {
      await this.categoryService.deleteCategory(slug)
      res.status(OK).json({ message: 'success' })
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/published-categories/:slug')
  @query(QueryFilterPublishedPostRequest)
  async getPublishedCategory(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const slug = req.params.slug as string
    const options = req.validated as QueryFilterPublishedPostRequest

    try {
      const category = await this.categoryService.getPublishedCategory(slug, options)
      res.status(OK).json(category)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/published-categories')
  @query(QueryFilterRequest)
  async getPublishedCategories(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const query = req.validated as QueryFilterRequest

    try {
      const result = await this.categoryService.getPublishedCategories(query)
      res.status(OK).json(result)
    } catch (error) {
      next(error)
    }
  }
}
