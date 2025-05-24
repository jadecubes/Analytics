import { Analytics } from './analytics.ts'
import { type BaseAnalyticsEvent } from '../types/events.ts'
import './analytics.ts'

export class TikTok extends Analytics<BaseAnalyticsEvent> {
  protected measurementId: string
  private static instance: TikTok | null = null
  constructor (config: Record<string, string>) {
    super()
    this.measurementId = config.measurementId
    this.initialize()
  }

  // Static getInstance method for singleton pattern
  public static getInstance (config: Record<string, string>): TikTok {
    if (!TikTok.instance) {
      TikTok.instance = new TikTok(config)
    }
    return TikTok.instance
  }

  public initialize (): void {
    this.setIsReady(false)
    const head = document.querySelector('head')
    const existingScript = document.querySelector(`script[data-id="tiktok-pixel-${this.measurementId}"]`)

    // Confirm only init once
    // Converted textContent is in sc-44553
    if (!existingScript) {
      const script = document.createElement('script')
      script.setAttribute('data-id', `tiktok-pixel-${this.measurementId}`)
      script.textContent = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject = t;
        var ttq = w[t] = w[t] || [];
        ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"], ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
          }
        };
        for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.instance = function (t) {
          for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++
          )ttq.setAndDefer(e, ttq.methods[n]);
          return e
        }, ttq.load = function (e, n) {
          var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
          ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
          var o = document.createElement("script");
          o.type = "text/javascript", o.async = !0, o.src = i + "?sdkid=" + e + "&lib=" + t;
          var a = document.getElementsByTagName("script")[0];
          a.parentNode.insertBefore(o, a)
        };

        ttq.load('${this.measurementId}');
        ttq.page();
      }(window, document, 'ttq');
      `
      script.onload = () => { this.setIsReady(true) }
      head?.appendChild(script)
    } else { this.setIsReady(true) }
  }

  public sendAnalyticsEvent (customEvent: BaseAnalyticsEvent): number {
    const { eventName, eventParams } = customEvent
    if (window.ttq) {
      try {
        window.ttq.track?.(eventName, eventParams)
        return 0
      } catch (error) {
        console.error('[TT] sendEvent', error)
        return -1
      }
    } else {
      console.error('[TT] ttq is not defined')
      return -1
    }
  }
}
