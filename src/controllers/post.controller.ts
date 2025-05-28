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
import { IPostService } from '@services/contracts/post.service.interface'
import { TYPES } from '@constants/types'
import { validate } from '@decorators/validator'
import { QUERY_FILTER_REQUEST } from '@requests/query.filter.request'
import { matchedData } from 'express-validator'
import { ID_REQUEST } from '@requests/id.request'
import { auth } from '@decorators/authenticate'
import { CREATE_POST_REQUEST } from '@requests/create.post.request'
import { UPDATE_POST_REQUEST } from '@requests/update.post.request'

@controller('/posts')
export class PostController {
  constructor(@inject(TYPES.PostService) private postService: IPostService) {}

  @httpGet('/published-posts')
  @validate(QUERY_FILTER_REQUEST)
  async getPublishedPosts(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const data = matchedData(req)

    try {
      const result = await this.postService.getPublishedPosts(data)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/published-post/:id')
  @validate(ID_REQUEST)
  async getPublishedPost(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const { id } = matchedData(req)

    try {
      const post = await this.postService.getPublishedPost(id!)
      return jsonResponse(res, post)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/related-posts/:id')
  @validate([...QUERY_FILTER_REQUEST, ...ID_REQUEST])
  async getRelatedPosts(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const { id, limit } = matchedData(req)

    try {
      const posts = await this.postService.getRelatedPosts(id, limit)
      return jsonResponse(res, posts)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/')
  @auth()
  @validate(QUERY_FILTER_REQUEST)
  async getPosts(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = matchedData(req)

    try {
      const result = await this.postService.findWithPagination(data)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/:id')
  @auth()
  @validate(ID_REQUEST)
  async getPost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { id } = matchedData(req)

    try {
      const post = await this.postService.findById(id)
      return jsonResponse(res, post)
    } catch (error) {
      next(error)
    }
  }

  @httpPost('/')
  @auth()
  @validate(CREATE_POST_REQUEST)
  async createPost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { categoryId, tagIds, ...rest } = matchedData(req)
    const { userId } = req.auth

    try {
      await this.postService.store(userId, categoryId, tagIds, rest)
      return jsonResponse(res, null, CREATED, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpPut('/:id')
  @auth()
  @validate([...UPDATE_POST_REQUEST, ...ID_REQUEST])
  async updatePost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { id, categoryId, tagIds, ...rest } = matchedData(req)

    try {
      await this.postService.updatePost(id, categoryId, tagIds, rest)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpDelete('/:id')
  @auth()
  @validate(ID_REQUEST)
  async deletePost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { id } = matchedData(req)

    try {
      await this.postService.deleteById(id)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }
}
