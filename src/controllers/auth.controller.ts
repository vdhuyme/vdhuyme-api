import { NextFunction, Request, Response } from 'express'
import {
  controller,
  httpGet,
  httpPatch,
  httpPost,
  httpPut,
  next,
  request,
  response
} from 'inversify-express-utils'
import { OK } from '@constants/http.status.code'
import { inject } from 'inversify'
import { REFRESH_TOKEN_REQUEST } from '@requests/refresh.token.request'
import { jsonResponse } from '@utils/json.response'
import { validate } from '@decorators/validator'
import { LOGIN_REQUEST } from '@requests/login.request'
import { matchedData } from 'express-validator'
import { TYPES } from '@constants/types'
import { auth } from '@decorators/authenticate'
import { IAuthService } from '@services/contracts/auth.service.interface'
import { CHANGE_PASSWORD_REQUEST } from '@requests/change.password.request'
import { REGISTER_REQUEST } from '@requests/register.request'
import { UPDATE_PROFILE_REQUEST } from '@requests/update.profile.request'

@controller('/auth')
export default class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  @httpPost('/login')
  @validate(LOGIN_REQUEST)
  async login(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { email, password } = matchedData(req)

    try {
      const result = await this.authService.login(email, password)
      return jsonResponse(res, result, OK)
    } catch (error) {
      next(error)
    }
  }

  @httpPost('/register')
  @validate(REGISTER_REQUEST)
  async register(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { name, email, password } = matchedData(req)

    try {
      const result = await this.authService.register(name, email, password)
      return jsonResponse(res, result, OK)
    } catch (error) {
      next(error)
    }
  }

  @httpGet('/me')
  @auth()
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
  @validate(REFRESH_TOKEN_REQUEST)
  async refreshAccessToken(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const { refreshToken } = matchedData(req)
    try {
      const accessToken = this.authService.refreshAccessToken(refreshToken)
      return jsonResponse(res, accessToken)
    } catch (error) {
      next(error)
    }
  }

  @httpPatch('/change-password')
  @auth()
  @validate(CHANGE_PASSWORD_REQUEST)
  async changePassword(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const { oldPassword, newPassword } = matchedData(req)
    const { userId } = req.auth

    try {
      await this.authService.changePassword(userId, oldPassword, newPassword)
      return jsonResponse(res, null, OK, 'success')
    } catch (error) {
      next(error)
    }
  }

  @httpPut('/profile')
  @auth()
  @validate(UPDATE_PROFILE_REQUEST)
  async updateProfile(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const data = matchedData(req)
    const { userId } = req.auth

    try {
      await this.authService.updateProfile(userId, data)
      return jsonResponse(res, null, OK, 'success')
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
