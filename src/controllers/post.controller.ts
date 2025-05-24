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
import { CREATED, OK } from '@utils/http.status.code'
import { authenticate } from '@decorators/authenticate'
import CreatePostRequest from '@requests/create.post.request'
import QueryFilterRequest from '@requests/query.filter.request'
import { body } from '@decorators/validate.body.decorator'
import { query } from '@decorators/validate.query.decorator'
import UpdatePostRequest from '@requests/update.post.request'
import QueryFilterPublishedPostRequest from '@requests/query.filter.published.post.request'

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
    const queryFilter = req.validated as QueryFilterPublishedPostRequest

    try {
      const result = await this.postService.getPublishedPosts(queryFilter)
      res.status(OK).json(result)
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
      res.status(OK).json(post)
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
    const { limit } = req.validated as QueryFilterRequest

    try {
      const posts = await this.postService.getRelatedPosts(slug, limit)
      return res.status(OK).json({ posts })
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/')
  @authenticate()
  @query(QueryFilterRequest)
  async getPosts(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const queryFilter = req.validated as QueryFilterRequest

    try {
      const { posts, total } = await this.postService.getPosts(queryFilter)
      return res.status(OK).json({ posts, total })
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
      return res.status(OK).json({ post })
    } catch (error) {
      next(error)
    }
  }

  @httpPost('/')
  @authenticate()
  @body(CreatePostRequest)
  async createPost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = req.validated as CreatePostRequest
    const { userId } = req.auth

    try {
      await this.postService.createPost(data, userId)
      return res.status(CREATED).json({ message: 'success' })
    } catch (error) {
      next(error)
    }
  }

  @httpPut('/:slug')
  @authenticate()
  @body(UpdatePostRequest)
  async updatePost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = req.validated as UpdatePostRequest
    const slug = req.params.slug as string

    try {
      await this.postService.updatePost(slug, data)
      return res.status(OK).json({ message: 'success' })
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
      return res.status(OK).json({ message: 'success' })
    } catch (error) {
      next(error)
    }
  }
}
