import { authenticate } from '@decorators/authenticate'
import { body, query } from '@decorators/validator'
import CreateTagRequest from '@requests/create.tag.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdateTagRequest from '@requests/update.tag.request'
import { ITagService } from '@services/contracts/tag.service.interface'
import { CREATED, OK } from '@utils/http.status.code'
import { jsonResponse } from '@utils/json.response'
import { NextFunction, Request, Response } from 'express'
import { inject } from 'inversify'
import { TYPES } from 'inversify-config'
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

@controller('/tags')
export default class TagController {
  constructor(@inject(TYPES.TagService) private tagService: ITagService) {}

  @httpPost('/')
  @authenticate()
  @body(CreateTagRequest)
  async createTag(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = req.body

    try {
      const tag = this.tagService.create(data)
      await this.tagService.save(tag)

      return jsonResponse(res, null, CREATED, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/')
  @authenticate()
  @query(QueryFilterRequest)
  async getTags(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const queryFilters = req.query

    try {
      const result = await this.tagService.findWithPagination(queryFilters)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpPut('/:id')
  @authenticate()
  @body(UpdateTagRequest)
  async updateTag(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const id = parseInt(req.params.id, 10)
    const data = req.body

    try {
      await this.tagService.updateById(id, data)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpDelete('/:id')
  @authenticate()
  async deleteTag(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const id = parseInt(req.params.id, 10)

    try {
      await this.tagService.deleteById(id)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }
}
