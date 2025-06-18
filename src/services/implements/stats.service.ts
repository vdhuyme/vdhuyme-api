import { config } from '@config/app'
import { ga4Client } from '@config/ga4.client'
import { GA4DateRange, IGA4CountryStatResponse } from 'interfaces'
import { Ga4CountryStatResource } from '@mappers/ga4.mapper'
import { IStatsService } from '@services/contracts/stats.service.interface'
import { format, isBefore, setHours, setMinutes, startOfMonth, subDays } from 'date-fns'

export default class StatsService implements IStatsService {
  async ga4(startAt?: Date, endAt?: Date): Promise<IGA4CountryStatResponse[]> {
    const { start, end } = this.getValidDateRange(startAt, endAt)

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

  /**
   * Calculates a valid date range for the GA4 report based on input and system time.
   *
   * - If the current time is before 9:00 AM, the default end date is set to yesterday.
   * - Otherwise, the default end date is today.
   * - If no `startAt` is provided, it defaults to the first day of the month of the end date.
   * - The start date is not allowed to be earlier than January 1, 2020.
   * - If `endAt` is provided, it will be used instead of the default end date.
   *
   * @param startAt - Optional custom start date.
   * @param endAt - Optional custom end date.
   * @returns An object containing the validated `start` and `end` dates.
   */
  private getValidDateRange(startAt?: Date, endAt?: Date): GA4DateRange {
    const minDate = new Date('2020-01-01')
    const now = new Date()
    const nineAM = setMinutes(setHours(new Date(now), 9), 0)
    const defaultEnd = now < nineAM ? subDays(now, 1) : now
    const rawStart = startAt ?? startOfMonth(defaultEnd)

    const start = isBefore(rawStart, minDate) ? minDate : rawStart
    const end = endAt ?? defaultEnd

    return { start, end }
  }
}
