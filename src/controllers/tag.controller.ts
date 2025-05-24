import { authenticate } from '@decorators/authenticate'
import { body } from '@decorators/validate.body.decorator'
import { query } from '@decorators/validate.query.decorator'
import { ITagService } from '@interfaces/services/tag.service.interface'
import CreateTagRequest from '@requests/create.tag.request'
import QueryFilterRequest from '@requests/query.filter.request'
import UpdateTagRequest from '@requests/update.tag.request'
import { CREATED, OK } from '@utils/http.status.code'
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
    const data = req.validated as CreateTagRequest

    try {
      await this.tagService.createTag(data)
      res.status(CREATED).json({ message: 'success' })
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/')
  @authenticate()
  @query(QueryFilterRequest)
  async getTags(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const queryFilter = req.validated as QueryFilterRequest

    try {
      const { tags, total } = await this.tagService.getTags(queryFilter)
      res.status(OK).json({ tags, total })
    } catch (error) {
      next(error)
    }
  }

  @httpPut('/:slug')
  @authenticate()
  @body(UpdateTagRequest)
  async updateTag(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const slug = req.params.slug
    const data = req.validated as UpdateTagRequest

    try {
      await this.tagService.updateTag(slug, data)
      res.status(OK).json({ message: 'success' })
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
      res.status(OK).json({ message: 'success' })
    } catch (error) {
      next(error)
    }
  }
}
