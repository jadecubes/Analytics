import { AnalyticsPlatforms } from '@analytics'
import { AnalyticsProvider } from '@analytics'

export function App() {
  return (
    <>
      <AnalyticsProvider config={{
        [AnalyticsPlatforms.GA]: { measurementId: import.meta.env.VITE_GA4_TRACKING_ID as string },
        [AnalyticsPlatforms.META]: { measurementId: import.meta.env.VITE_META_TRACKING_ID as string },
        [AnalyticsPlatforms.TIKTOK]: { measurementId: import.meta.env.VITE_TIKTOK_TRACKING_ID as string },
      }}
      >
        Welcome to analyticsApp!
      </AnalyticsProvider>

    </>
  )
}

export default App
