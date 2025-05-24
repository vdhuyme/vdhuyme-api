import { NextFunction, Request, Response } from 'express'
import { controller, httpGet, httpPost, next, request, response } from 'inversify-express-utils'
import { OK } from '@utils/http.status.code'
import { body } from '@decorators/validate.body.decorator'
import LoginRequest from '@requests/login.request'
import { inject } from 'inversify'
import { IAuthService } from '@interfaces/services/auth.service.interface'
import { authenticate } from '@decorators/authenticate'
import RefreshTokenRequest from '@requests/refresh.token.request'

@controller('/auth')
export default class AuthController {
  constructor(@inject('IAuthService') private authService: IAuthService) {}

  @httpPost('/login')
  @body(LoginRequest)
  async login(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const data = req.validated as LoginRequest

    try {
      const { accessToken, refreshToken } = await this.authService.login(data)
      return res.status(OK).json({ accessToken, refreshToken })
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

  @httpGet('/redirect/google')
  async redirect(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    try {
      const url = await this.authService.redirect()
      return res.status(OK).json({ url })
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/callback/google')
  async callback(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const code = req.query.code as string

    try {
      const { accessToken, refreshToken } = await this.authService.callback(code)
      return res.status(OK).json({ accessToken, refreshToken })
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
    const { refreshToken } = req.validated as RefreshTokenRequest
    try {
      const accessToken = this.authService.refreshAccessToken(refreshToken)
      return res.status(OK).json({ accessToken })
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/health-check')
  healthCheck(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    try {
      res.status(OK).json({
        uptime: process.uptime(),
        timestamp: Date.now()
      })
    } catch (error) {
      next(error)
    }
  }
}
