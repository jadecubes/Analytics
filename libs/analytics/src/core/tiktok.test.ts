import { type BaseAnalyticsEvent } from '../types/events'
import { TikTok } from './Tiktok'

describe('TikTok Analytics', () => {
  const measurementId = 'TT-TEST-ID'
  const config = { measurementId }

  beforeEach(() => {
    jest.useFakeTimers()
    // Reset global and DOM state
    window.ttq = undefined
    document.head.innerHTML = ''
    // @ts-expect-error: override singleton for test
    TikTok.instance = null
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return singleton instance', () => {
    const a = TikTok.getInstance(config)
    const b = TikTok.getInstance(config)
    expect(a).toBe(b)
  })

  it('should inject TikTok script with correct data-id and simulate load', () => {
    const tiktok = TikTok.getInstance(config)
    const script = document.querySelector(`script[data-id="tiktok-pixel-${measurementId}"]`)
    expect(script).not.toBeNull()

    // Simulate script load to trigger isReady
    script?.dispatchEvent(new Event('load'))

    expect(tiktok.isReady).toBe(true)
  })

  it('should queue and send event when ttq is ready after retry', () => {
    const tiktok = TikTok.getInstance(config)
    const mockTtq = {
      track: jest.fn(),
      push: jest.fn(),
      page: jest.fn(),
      load: jest.fn(),
    }
    window.ttq = mockTtq

    const event: BaseAnalyticsEvent = {
      eventName: 'view_product',
      eventParams: { id: '123', name: 'Shoes' },
    }

    tiktok.processAnalyticsEvent(event)
    tiktok['setIsReady'](true)

    jest.advanceTimersByTime(1500)

    expect(mockTtq.track).toHaveBeenCalledWith('view_product', {
      id: '123',
      name: 'Shoes',
    })
  })
})
