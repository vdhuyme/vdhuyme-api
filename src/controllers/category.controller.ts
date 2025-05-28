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
import { CREATED, OK } from '@constants/http.status.code'
import { jsonResponse } from '@utils/json.response'
import { auth } from '@decorators/authenticate'
import { validate } from '@decorators/validator'
import { QUERY_FILTER_REQUEST } from '@requests/query.filter.request'
import { matchedData } from 'express-validator'
import { ICategoryService } from '@services/contracts/category.service.interface'
import { TYPES } from '@constants/types'
import { UPDATE_CATEGORY_REQUEST } from '@requests/update.category.request'
import { CREATE_CATEGORY_REQUEST } from '@requests/create.category.request'

@controller('/categories')
export default class CategoryController {
  constructor(@inject(TYPES.CategoryService) private categoryService: ICategoryService) {}

  @httpGet('/published-categories')
  @validate(QUERY_FILTER_REQUEST)
  async getPublishedCategories(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const data = matchedData(req)

    try {
      const result = await this.categoryService.getPublishedCategories(data)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/published-categories/:id')
  async getPublishedCategory(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const id = req.params.id as string

    try {
      const category = await this.categoryService.getPublishedCategory(id)
      return jsonResponse(res, category)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/')
  @auth()
  @validate(QUERY_FILTER_REQUEST)
  async index(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = matchedData(req)

    try {
      const result = await this.categoryService.findWithPagination(data)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/trees')
  @auth()
  async getTrees(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    try {
      const result = await this.categoryService.getTrees()
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpPost('/')
  @auth()
  @validate(CREATE_CATEGORY_REQUEST)
  async store(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = matchedData(req)

    try {
      const category = this.categoryService.create(data)
      await this.categoryService.save(category)
      return jsonResponse(res, null, CREATED, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpPut('/:id')
  @auth()
  @validate(UPDATE_CATEGORY_REQUEST)
  async update(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = matchedData(req)
    const id = req.params.id as string

    try {
      await this.categoryService.updateById(id, data)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpDelete('/:id')
  @auth()
  async destroy(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const id = req.params.id as string

    try {
      await this.categoryService.deleteById(id)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }
}
