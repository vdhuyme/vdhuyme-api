import { authenticate } from '@decorators/authenticate'
import { body, query } from '@decorators/validator'
import { ITagService } from '@interfaces/services/tag.service.interface'
import CreateTagRequest from '@requests/create.tag.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdateTagRequest from '@requests/update.tag.request'
import { CREATED, OK } from '@utils/http.status.code'
import { jsonResponse } from '@utils/json.response'
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

@controller('/tags')
export default class TagController {
  constructor(@inject('ITagService') private tagService: ITagService) {}

  @httpPost('/')
  @authenticate()
  @body(CreateTagRequest)
  async createTag(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = req.body as CreateTagRequest

    try {
      await this.tagService.createTag(data)
      return jsonResponse(res, null, CREATED, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/')
  @authenticate()
  @query(QueryFilterRequest)
  async getTags(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const queryFilters = req.query as unknown as QueryFilterRequest

    try {
      const result = await this.tagService.getTags(queryFilters)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpPut('/:slug')
  @authenticate()
  @body(UpdateTagRequest)
  async updateTag(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const slug = req.params.slug
    const data = req.body as UpdateTagRequest

    try {
      await this.tagService.updateTag(slug, data)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpDelete('/:slug')
  @authenticate()
  async deleteTag(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const slug = req.params.slug

    try {
      await this.tagService.deleteTag(slug)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }
}
