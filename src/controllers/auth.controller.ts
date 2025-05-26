import { NextFunction, Request, Response } from 'express'
import { controller, httpGet, httpPost, next, request, response } from 'inversify-express-utils'
import { OK } from '@utils/http.status.code'
import LoginRequest from '@requests/login.request'
import { inject } from 'inversify'
import { IAuthService } from '@interfaces/services/auth.service.interface'
import { authenticate } from '@decorators/authenticate'
import RefreshTokenRequest from '@requests/refresh.token.request'
import { jsonResponse } from '@utils/json.response'
import { body } from '@decorators/validator'

@controller('/auth')
export default class AuthController {
  constructor(@inject('IAuthService') private authService: IAuthService) {}

  @httpPost('/login')
  @body(LoginRequest)
  async login(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = req.body as LoginRequest

    try {
      const result = await this.authService.login(data)
      return jsonResponse(res, result, OK)
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
      return jsonResponse(res, user)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/redirect/google')
  redirect(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    try {
      const url = this.authService.redirect()
      return jsonResponse(res, url)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/callback/google')
  async callback(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const code = req.query.code as string

    try {
      const result = await this.authService.callback(code)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }

  @httpPost('/refresh-token')
  @body(RefreshTokenRequest)
  async refreshAccessToken(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const { refreshToken } = req.body as RefreshTokenRequest
    try {
      const accessToken = this.authService.refreshAccessToken(refreshToken)
      return jsonResponse(res, accessToken)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/health-check')
  healthCheck(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    try {
      const uptime = process.uptime()
      const timestamp = Date.now()
      return jsonResponse(res, { uptime, timestamp })
    } catch (error) {
      next(error)
    }
  }
}
