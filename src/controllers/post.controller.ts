import { NextFunction, Request, Response } from 'express'
import { inject } from 'inversify'
import { controller, httpGet, httpPost, next, request, response } from 'inversify-express-utils'
import { IPostService } from '@interfaces/index'
import { OK } from '@utils/http.status.code'
import { authenticate } from '@decorators/authenticate'
import CreatePostRequest from '@requests/create.post.request'
import QueryFilterRequest from '@requests/query.filter.request'
import { body } from '@decorators/validate.body.decorator'
import { query } from '@decorators/validate.query.decorator'

@controller('/posts')
export class PostController {
  constructor(@inject('PostService') private postService: IPostService) {}

  @httpPost('/')
  @authenticate()
  @body(CreatePostRequest)
  async createPost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = req.validated as CreatePostRequest

    try {
      const post = await this.postService.createPost(data)
      return res.status(OK).json({ post })
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
}
