import { authenticate } from '@decorators/authenticate'
import { body, query } from '@decorators/validator'
import { ICommentService } from '@interfaces/services/comment.service.interface'
import CreateCommentRequest from '@requests/create.comment.request'
import QueryFilterCommentRequest from '@requests/query.filter.comment.request'
import UpdateCommentRequest from '@requests/update.comment.request'
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

@controller('/comments')
export default class CommentController {
  constructor(@inject('ICommentService') private commentService: ICommentService) {}

  @httpGet('/by-post/:slug')
  @query(QueryFilterCommentRequest)
  async getCommentsByPost(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const slug = req.params.slug as string
    const queryFilters = req.query as unknown as QueryFilterCommentRequest

    try {
      const result = await this.commentService.getCommentsByPostSlug(slug, queryFilters)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpPost('/')
  @authenticate()
  @body(CreateCommentRequest)
  async createComment(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const data = req.body as CreateCommentRequest
    const { userId } = req.auth

    try {
      await this.commentService.createComment(data, userId)
      return jsonResponse(res, null, CREATED, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/')
  @authenticate()
  @query(QueryFilterCommentRequest)
  async getComments(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const queryFilters = req.query as unknown as QueryFilterCommentRequest

    try {
      const result = await this.commentService.getComments(queryFilters)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpPut('/:id')
  @authenticate()
  @body(UpdateCommentRequest)
  async updateComment(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const id = parseInt(req.params.id, 10)
    const data = req.body as UpdateCommentRequest

    try {
      await this.commentService.updateComment(id, data)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpDelete('/:id')
  @authenticate()
  async deleteComment(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const id = parseInt(req.params.id, 10)

    try {
      await this.commentService.deleteComment(id)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }
}
