import { IGA4CountryStatResponse } from '@interfaces/index'

export interface IStatsService {
  ga4(startAt: Date, endAt: Date): Promise<IGA4CountryStatResponse[]>
}
