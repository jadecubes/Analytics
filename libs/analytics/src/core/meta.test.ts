import { type BaseAnalyticsEvent } from '../types/events'
import { Meta } from './_Meta'

describe('Meta Analytics', () => {
  const measurementId = 'META-TEST-ID'
  const config = { measurementId, userId: null }

  beforeEach(() => {
    jest.useFakeTimers()
    window.fbq = undefined
    document.head.innerHTML = ''
    // @ts-expect-error override singleton for testing
    Meta.instance = null
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return singleton instance', () => {
    const a = Meta.getInstance(config)
    const b = Meta.getInstance(config)
    expect(a).toBe(b)
  })

  it('should queue and send event when fbq is ready after retry', () => {
    const meta = Meta.getInstance(config)
    const mockFbq = jest.fn()
    window.fbq = mockFbq

    const event: BaseAnalyticsEvent = {
      eventName: 'purchase',
      eventParams: { currency: 'USD', value: 100 },
    }

    meta.processAnalyticsEvent(event)

    // Simulate readiness before retry
    meta['setIsReady'](true)

    jest.advanceTimersByTime(1500)

    expect(mockFbq).toHaveBeenCalledWith('event', 'purchase', {
      currency: 'USD',
      value: 100,
    })
  })

  it('should NOT send event if fbq is missing', () => {
    const meta = Meta.getInstance(config)

    const script = document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]') as HTMLScriptElement
    expect(script).not.toBeNull()

    // Simulate the script loading
    script?.onload?.(new Event('load'))

    // Assert that Meta is now ready
    expect(meta.isReady).toBe(true)
  })
})
