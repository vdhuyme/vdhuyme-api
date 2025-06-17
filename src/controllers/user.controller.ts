import { TYPES } from '@constants/types'
import { auth } from '@decorators/authenticate'
import { permissions } from '@decorators/authorize'
import { validate } from '@decorators/validator'
import { ID_REQUEST } from '@requests/id.request'
import { QUERY_FILTER_REQUEST } from '@requests/query.filter.request'
import { UPDATE_USER_STATUS_REQUEST } from '@requests/update.user.status.request'
import { IUserService } from '@services/contracts/user.service.interface'
import { jsonResponse } from '@utils/json.response'
import { NextFunction, Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { inject } from 'inversify'
import { controller, httpGet, httpPatch, next, request, response } from 'inversify-express-utils'

@controller('/users')
export default class UserController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  @httpGet('/')
  @auth()
  @permissions('user.read')
  @validate(QUERY_FILTER_REQUEST)
  async index(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = matchedData(req)

    try {
      const result = await this.userService.paginateWithDTO(data)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpPatch('/:id')
  @auth()
  @permissions('user.update')
  @validate([...ID_REQUEST, ...UPDATE_USER_STATUS_REQUEST])
  async update(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { id, status } = matchedData(req)

    try {
      await this.userService.updateStatus(id, status)
      return jsonResponse(res, 'ok')
    } catch (error) {
      next(error)
    }
  }
}
