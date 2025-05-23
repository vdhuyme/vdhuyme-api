import { NextFunction, Request, Response } from 'express'
import { inject } from 'inversify'
import { controller, httpGet, httpPost, next, request, response } from 'inversify-express-utils'
import { IPostService } from '@interfaces/index'
import { OK } from '@utils/http.status.code'
import { validate } from '@middlewares/validation'
import CreatePostRequest from '@requests/create.post.request'

@controller('/posts')
export class PostController {
  constructor(@inject('PostService') private postService: IPostService) {}

  @httpPost('/', validate(CreatePostRequest))
  async createPost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data: CreatePostRequest = req.validated

    try {
      const post = await this.postService.createPost(data)
      return res.status(OK).json({ post })
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/:slug')
  async getPost(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { slug } = req.params

    try {
      const post = await this.postService.getPost(slug)
      return res.status(OK).json({ post })
    } catch (error) {
      next(error)
    }
  }
}
