import { TYPES } from '@constants/types'
import { auth } from '@decorators/authenticate'
import { IImagekitService } from '@services/contracts/imagekit.service.interface'
import { jsonResponse } from '@utils/json.response'
import { NextFunction, Request, Response } from 'express'
import { inject } from 'inversify'
import { controller, httpGet, next, request, response } from 'inversify-express-utils'

@controller('/imagekit')
export default class ImagekitController {
  constructor(@inject(TYPES.ImagekitService) private imagekitService: IImagekitService) {}

  @httpGet('/auth')
  @auth()
  async auth(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    try {
      const result = this.imagekitService.auth()
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }
}
