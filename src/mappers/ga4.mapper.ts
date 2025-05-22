import type { protos } from '@google-analytics/data'
import { IGA4CountryStat } from 'interfaces'

type RunReportResponse = protos.google.analytics.data.v1beta.IRunReportResponse
type RunReportRow = protos.google.analytics.data.v1beta.IRow

export class Ga4CountryStatResource {
  static toDto(row: RunReportRow): IGA4CountryStat {
    const country = row.dimensionValues?.[0]?.value ?? 'Unknown'
    const activeUsers = parseInt(row.metricValues?.[0]?.value ?? '0', 10)
    const pageViews = parseInt(row.metricValues?.[1]?.value ?? '0', 10)

    return { country, activeUsers, pageViews }
  }

  static collection(response: RunReportResponse): IGA4CountryStat[] {
    return response.rows?.map(row => this.toDto(row)) || []
  }
}
