import { TYPES } from '@constants/types'
import { auth } from '@decorators/authenticate'
import { validate } from '@decorators/validator'
import { CREATE_TAG_REQUEST } from '@requests/create.tag.request'
import { UPDATE_TAG_REQUEST } from '@requests/update.tag.request'
import { ITagService } from '@services/contracts/tag.service.interface'
import { CREATED } from '@constants/http.status.code'
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
import { matchedData } from 'express-validator'
import { QUERY_FILTER_REQUEST } from '@requests/query.filter.request'
import { ID_REQUEST } from '@requests/id.request'

@controller('/tags')
export default class TagController {
  constructor(@inject(TYPES.TagService) private tagService: ITagService) {}

  @httpPost('/')
  @auth()
  @validate(CREATE_TAG_REQUEST)
  async store(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = matchedData(req)

    try {
      const tag = this.tagService.create(data)
      await this.tagService.save(tag)
      return jsonResponse(res, 'ok', CREATED)
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
      const result = await this.tagService.findWithPagination(data)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }
  @httpPut('/:id')
  @auth()
  @validate([...UPDATE_TAG_REQUEST, ...ID_REQUEST])
  async update(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { id, ...rest } = matchedData(req)

    try {
      await this.tagService.updateById(id, rest)
      return jsonResponse(res, 'ok')
    } catch (error) {
      next(error)
    }
  }

  @httpDelete('/:id')
  @auth()
  @validate(ID_REQUEST)
  async destroy(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = matchedData(req)

    try {
      await this.tagService.deleteById(data.id)
      return jsonResponse(res, 'ok')
    } catch (error) {
      next(error)
    }
  }
}
