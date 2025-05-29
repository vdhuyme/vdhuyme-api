import { TYPES } from '@constants/types'
import { auth } from '@decorators/authenticate'
import { validate } from '@decorators/validator'
import { QUERY_FILTER_REQUEST } from '@requests/query.filter.request'
import { IUserService } from '@services/contracts/user.service.interface'
import { jsonResponse } from '@utils/json.response'
import { NextFunction, Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { inject } from 'inversify'
import { controller, httpGet, next, request, response } from 'inversify-express-utils'

@controller('/users')
export default class UserController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  @httpGet('/')
  @auth()
  @validate(QUERY_FILTER_REQUEST)
  async index(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = matchedData(req)

    try {
      const result = await this.userService.paginate(data)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }
}
