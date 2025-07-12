import { type BaseAnalyticsEvent } from '../types/events.ts'
import { Analytics } from './_Analytics.ts'

export interface MetaPixelConfig {
  measurementId: string
  userId?: string | null
}

export class Meta extends Analytics<BaseAnalyticsEvent> {
  protected measurementId: string
  private static instance: Meta | null = null

  constructor(config: MetaPixelConfig) {
    super()
    this.measurementId = config.measurementId
    this.initialize()
  }

  // Static getInstance method for singleton pattern
  public static getInstance(config: MetaPixelConfig): Meta {
    if (!Meta.instance) {
      Meta.instance = new Meta(config)
    }
    return Meta.instance
  }

  protected initialize(): void {
    this.setIsReady(false)
    const head = document.querySelector('head')
    const existingScript = document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]')
    // https://www.facebook.com/help/1604282442927573
    if (!existingScript) {
      const script = document.createElement('script')
      script.textContent = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${this.measurementId}');
      fbq('track', 'PageView');
      `
      script.onload = () => {
        this.setIsReady(true)
      }
      head?.appendChild(script)
    }
    else { this.setIsReady(true) }
  }

  protected sendAnalyticsEvent(customEvent: BaseAnalyticsEvent): number {
    const { eventName, eventParams } = customEvent
    const fbqEvent = ['event', eventName, eventParams]
    if (window.fbq) {
      try {
        window.fbq(...fbqEvent)
        return 0
      }
      catch (error) {
        console.error('[META] sendEvent', error)
        return -1
      }
    }
    else {
      console.error('[META] fbq is not defined')
      return -1
    }
  }
}
