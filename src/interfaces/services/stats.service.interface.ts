import { IGA4CountryStat } from '@interfaces/ga4/ga4-country-stat'
import QueryFilterRequest from '@requests/query.filter.request'

export interface IStatsService {
  ga4(options: QueryFilterRequest): Promise<IGA4CountryStat[]>
}
