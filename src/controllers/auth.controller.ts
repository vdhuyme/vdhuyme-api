import { NextFunction, Request, Response } from 'express'
import { controller, httpGet, httpPost, next, request, response } from 'inversify-express-utils'
import { OK } from '@utils/http.status.code'
import { body } from '@decorators/validate.body.decorator'
import LoginRequest from '@requests/login.request'
import { inject } from 'inversify'
import { IAuthService } from '@interfaces/services/auth.service.interface'
import { authenticate } from '@decorators/authenticate'

@controller('/auth')
export default class AuthController {
  constructor(@inject('AuthService') private authService: IAuthService) {}

  @httpPost('/login')
  @body(LoginRequest)
  async login(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = req.validated as LoginRequest

    try {
      const token = await this.authService.login(data)
      return res.status(OK).json({ token })
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/me')
  @authenticate()
  async me(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { userId } = req.auth

    try {
      const user = await this.authService.getUserInfo(userId)
      return res.status(OK).json({ user })
    } catch (error) {
      next(error)
    }
  }
}
