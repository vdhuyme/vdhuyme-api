import { TYPES } from '@constants/types'
import { auth } from '@decorators/authenticate'
import { permissions } from '@decorators/authorize'
import { validate } from '@decorators/validator'
import { GA4_REQUEST } from '@requests/ga4.request'
import { IStatsService } from '@services/contracts/stats.service.interface'
import { jsonResponse } from '@utils/json.response'
import { NextFunction, Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { inject } from 'inversify'
import { controller, httpGet, next, request, response } from 'inversify-express-utils'

@controller('/stats')
export default class StatsController {
  constructor(@inject(TYPES.StatsService) private statsService: IStatsService) {}

  @httpGet('/ga4')
  @auth()
  @permissions('stats.ga4')
  @validate(GA4_REQUEST)
  async ga4(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const { startAt, endAt } = matchedData(req)

    try {
      const result = await this.statsService.ga4(startAt, endAt)
      return jsonResponse(res, result)
    } catch (error) {
      next(error)
    }
  }
}
