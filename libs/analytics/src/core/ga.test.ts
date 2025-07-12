import { type BaseAnalyticsEvent } from '../types/events'
import { Ga } from './Ga'

describe('Ga Analytics', () => {
  const measurementId = 'GA-TEST-ID'
  const config = { measurementId }

  beforeEach(() => {
    jest.useFakeTimers()

    window.gtag = undefined
    window.dataLayer = undefined
    document.head.innerHTML = ''
    // @ts-expect-error: override singleton
    Ga.instance = null
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return singleton instance', () => {
    const a = Ga.getInstance(config)
    const b = Ga.getInstance(config)
    expect(a).toBe(b)
  })

  it('should inject GA script and set up gtag', () => {
    Ga.getInstance(config)
    const script = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`)
    expect(script).toBeTruthy()
    expect(typeof window.gtag).toBe('function')
    expect(window.dataLayer).toBeDefined()
  })

  it('should queue and send events when gtag is ready after delay', async () => {
    const ga = Ga.getInstance(config)
    const mockGtag = jest.fn()
    window.gtag = mockGtag

    const event: BaseAnalyticsEvent = {
      eventName: 'login',
      eventParams: { method: 'email' },
    }

    ga.processAnalyticsEvent(event)

    // Simulate readiness before retry
    ga['setIsReady'](true)

    jest.advanceTimersByTime(1500)

    expect(mockGtag).toHaveBeenCalledWith('event', 'login', { method: 'email' })
  })
})
