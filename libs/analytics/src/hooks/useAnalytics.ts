import { useContext } from 'react'
import { AnalyticsContext, type AnalyticsContextProps } from '../react/AnalyticsProvider'

export const useAnalytics = (): AnalyticsContextProps => {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}
