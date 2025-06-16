import { CREATED, OK } from '@constants/http.status.code'
import { TYPES } from '@constants/types'
import { auth } from '@decorators/authenticate'
import { permissions } from '@decorators/authorize'
import { validate } from '@decorators/validator'
import { CREATE_COMMENT_REQUEST } from '@requests/create.comment.request'
import { ID_REQUEST } from '@requests/id.request'
import { QUERY_FILTER_REQUEST } from '@requests/query.filter.request'
import { UPDATE_COMMENT_REQUEST } from '@requests/update.comment.request'
import { ICommentService } from '@services/contracts/comment.service.interface'
import { jsonResponse } from '@utils/json.response'
import { NextFunction, Request, Response } from 'express'
import { matchedData } from 'express-validator'
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

@controller('/comments')
export default class CommentController {
  constructor(@inject(TYPES.CommentService) private commentService: ICommentService) {}

  @httpGet('/by-post/:id')
  @validate([...QUERY_FILTER_REQUEST, ...ID_REQUEST])
  async getCommentsByPost(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const { id, ...rest } = matchedData(req)

    try {
      const result = await this.commentService.getCommentsByPost(id, rest)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpPost('/')
  @auth()
  @validate(CREATE_COMMENT_REQUEST)
  async store(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = matchedData(req)
    const { userId } = req.auth

    try {
      await this.commentService.store(userId, data)
      return jsonResponse(res, null, CREATED, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/')
  @auth()
  @permissions('comment.read')
  @validate(QUERY_FILTER_REQUEST)
  async index(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = matchedData(req)

    try {
      const result = await this.commentService.paginate(data)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpPut('/:id')
  @auth()
  @permissions('comment.update')
  @validate([...UPDATE_COMMENT_REQUEST, ...ID_REQUEST])
  async update(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { id, ...rest } = matchedData(req)

    try {
      await this.commentService.updateById(id, rest)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpDelete('/:id')
  @auth()
  @permissions('comment.delete')
  @validate(ID_REQUEST)
  async destroy(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { id } = matchedData(req)

    try {
      await this.commentService.deleteById(id)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }
}
