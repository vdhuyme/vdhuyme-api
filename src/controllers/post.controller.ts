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
import { IPostService } from '@interfaces/index'
import { CREATED, OK } from '@constants/http.status.code'
import { authenticate } from '@decorators/authenticate'
import CreatePostRequest from '@requests/create.post.request'
import QueryFilterRequest from '@requests/query.filter.request'
import { body, query } from '@decorators/validator'
import UpdatePostRequest from '@requests/update.post.request'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'
import { jsonResponse } from '@utils/json.response'

@controller('/posts')
export class PostController {
  constructor(@inject('IPostService') private postService: IPostService) {}

  @httpGet('/published-posts')
  @query(QueryFilterPublishedPostRequest)
  async getPublishedPosts(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const queryFilters = req.query as unknown as QueryFilterPublishedPostRequest

    try {
      const result = await this.postService.getPublishedPosts(queryFilters)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/published-post/:slug')
  async getPublishedPost(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const slug = req.params.slug as string

    try {
      const post = await this.postService.getPublishedPost(slug)
      return jsonResponse(res, post)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/related-posts/:slug')
  @query(QueryFilterRequest)
  async getRelatedPosts(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const slug = req.params.slug as string
    const { limit } = req.query as unknown as QueryFilterRequest

    try {
      const posts = await this.postService.getRelatedPosts(slug, limit)
      return jsonResponse(res, posts)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/')
  @authenticate()
  @query(QueryFilterRequest)
  async getPosts(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const queryFilters = req.query as unknown as QueryFilterRequest

    try {
      const result = await this.postService.getPosts(queryFilters)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/:slug')
  @authenticate()
  async getPost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { slug } = req.params

    try {
      const post = await this.postService.getPost(slug)
      return jsonResponse(res, post)
    } catch (error) {
      next(error)
    }
  }

  @httpPost('/')
  @authenticate()
  @body(CreatePostRequest)
  async createPost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = req.body as unknown as CreatePostRequest
    const { userId } = req.auth

    try {
      await this.postService.createPost(data, userId)
      return jsonResponse(res, null, CREATED, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpPut('/:slug')
  @authenticate()
  @body(UpdatePostRequest)
  async updatePost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = req.body as unknown as UpdatePostRequest
    const slug = req.params.slug as string

    try {
      await this.postService.updatePost(slug, data)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpDelete('/:slug')
  @authenticate()
  async deletePost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const slug = req.params.slug as string

    try {
      await this.postService.deletePost(slug)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }
}
