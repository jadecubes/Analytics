import { type BaseAnalyticsEvent } from '../types/events.ts'
import { Analytics } from './Analytics.ts'
import './Analytics.ts'

export class Ga extends Analytics<BaseAnalyticsEvent> {
  protected measurementId: string
  private static instance: Ga | null = null

  constructor(config: Record<string, string>) {
    super()
    this.measurementId = config.measurementId
    this.initialize()
  }

  // Static getInstance method for singleton pattern
  public static getInstance(config: Record<string, string>): Ga {
    if (!Ga.instance) {
      Ga.instance = new Ga(config)
    }
    return Ga.instance
  }

  protected initialize() {
    this.setIsReady(false)
    const head = document.querySelector('head')
    const existingScript = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${this.measurementId}"]`)
    // dataLayer needs to be initialized before GA script is loaded
    window.dataLayer = window.dataLayer || []
    // https://developers.google.com/tag-platform/devguides/datalayer
    function gtag() {
      window.dataLayer?.push(arguments)
    }

    if (!window.gtag) {
      window.gtag = gtag
      window.gtag('js', new Date())
      window.gtag('config', this.measurementId)
    }

    // Only init script once
    if (!existingScript) {
      const script = document.createElement('script')
      script.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`)
      script.async = true
      script.onload = () => {
        this.setIsReady(true)
      }
      head?.appendChild(script)
    }
    else {
      this.setIsReady(true)
    }
  }

  protected sendAnalyticsEvent(customEvent: BaseAnalyticsEvent): number {
    const { eventName, eventParams } = customEvent

    const gtagEvent = ['event', eventName, eventParams]

    if (window.gtag) {
      try {
        window.gtag(...gtagEvent)
        return 0
      }
      catch (error) {
        console.error('[GA] sendEvent', error)
        return -1
      }
    }
    else {
      console.error('[GA] gtag is not defined')
      return -1
    }
  }
}
