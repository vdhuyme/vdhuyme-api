import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { storage } from '@utils/storage'

export const ga4Client = new BetaAnalyticsDataClient({
  keyFile: storage.storagePath('data/google-analyst.json')
})
