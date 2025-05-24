import { config } from '@config/app'
import { ga4Client } from '@config/ga4.client'
import { IGA4CountryStat } from '@interfaces/index'
import { IStatsService } from '@interfaces/services/stats.service.interface'
import { Ga4CountryStatResource } from '@mappers/ga4.mapper'
import QueryFilterRequest from '@requests/query.filter.request'
import { format } from 'date-fns'

export default class StatsService implements IStatsService {
  async ga4(options: QueryFilterRequest): Promise<IGA4CountryStat[]> {
    const { endDate, startDate } = options

    const today = new Date()
    const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const defaultEnd = today
    const start = startDate ?? defaultStart
    const end = endDate ?? defaultEnd

    const [response] = await ga4Client.runReport({
      property: `properties/${config.ga4.propertyId}`,
      dateRanges: [
        {
          startDate: format(start, 'yyyy-MM-dd'),
          endDate: format(end, 'yyyy-MM-dd')
        }
      ],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }]
    })

    return Ga4CountryStatResource.collection(response)
  }
}
