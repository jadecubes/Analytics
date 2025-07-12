import { AnalyticsPlatforms } from '../core/_Analytics'
import { Ga, GA4Config } from '../core/Ga'
import { Meta, MetaPixelConfig } from '../core/Meta'
import { TikTokPixelConfig, TikTok } from '../core/Tiktok'

export type AnalyticsConfig = Partial<{
  [AnalyticsPlatforms.GA]: GA4Config
  [AnalyticsPlatforms.META]: MetaPixelConfig
  [AnalyticsPlatforms.TIKTOK]: TikTokPixelConfig
}>

const analyticsInstances: Partial<{
  [AnalyticsPlatforms.GA]: Ga
  [AnalyticsPlatforms.META]: Meta
  [AnalyticsPlatforms.TIKTOK]: TikTok
}> = {}

export const createAnalyticsProviders = (config: AnalyticsConfig) => {
  if (config[AnalyticsPlatforms.GA]) {
    analyticsInstances[AnalyticsPlatforms.GA] = Ga.getInstance(config[AnalyticsPlatforms.GA])
  }
  if (config[AnalyticsPlatforms.META]) {
    analyticsInstances[AnalyticsPlatforms.META] = Meta.getInstance(config[AnalyticsPlatforms.META])
  }
  if (config[AnalyticsPlatforms.TIKTOK]) {
    analyticsInstances[AnalyticsPlatforms.TIKTOK] = TikTok.getInstance(config[AnalyticsPlatforms.TIKTOK])
  }
}

export const getAnalyticsInstance = (platform: AnalyticsPlatforms) => analyticsInstances[platform]
