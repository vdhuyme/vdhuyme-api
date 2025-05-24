import { authenticate } from '@decorators/authenticate'
import { query } from '@decorators/validate.query.decorator'
import { IStatsService } from '@interfaces/services/stats.service.interface'
import QueryFilterRequest from '@requests/query.filter.request'
import { OK } from '@utils/http.status.code'
import { NextFunction, Request, Response } from 'express'
import { inject } from 'inversify'
import { controller, httpGet, next, request, response } from 'inversify-express-utils'

@controller('/stats')
export default class StatsController {
  constructor(@inject('IStatsService') private statsService: IStatsService) {}

  @httpGet('/ga4')
  @authenticate()
  @query(QueryFilterRequest)
  async ga4(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    const queryFilter = req.validated as QueryFilterRequest

    try {
      const result = await this.statsService.ga4(queryFilter)
      res.status(OK).json(result)
    } catch (error) {
      next(error)
    }
  }
}
