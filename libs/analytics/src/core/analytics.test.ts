import { TIME_WAIT_FOR_READY_PLATFORM } from './analytics'
import { type BaseAnalyticsEvent } from '../types/events'
import { Ga } from './ga'
import { Meta } from './meta'
import { TikTok } from './tiktok'

const GA_MEASUREMENT_ID = 'G-xxxxxxxxxx'
const TIKTOK_MEASUREMENT_ID = '1111111111111111'
const META_MEASUREMENT_ID = '1111111111111111'

describe('Test Analytics', () => {
  let mockEvent: BaseAnalyticsEvent

  beforeEach(() => {
    // Reset document and window mocks
    resetGa()
    resetMeta()
    resetTiktok()

    // Define a mock event
    mockEvent = {
      eventName: 'test_event',
      eventParams: { param1: 'value1' }
    }
  })
  function resetGa () {
    document.head.innerHTML = ''
    window.gtag = jest.fn() // Mock window.gtag to track the network call
    window.dataLayer = undefined
  }
  function resetMeta () {
    document.head.innerHTML = ''
    window.fbq = jest.fn()
  }
  function resetTiktok () {
    document.head.innerHTML = ''
    window.ttq = {
      track: jest.fn(),
      push: jest.fn(),
      page: jest.fn(),
      load: jest.fn()
    }
  }

  function mockScriptLoading (delay: number) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalCreateElement = document.createElement

    // Mock document.createElement to simulate script loading
    const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'script') {
        const script = originalCreateElement.call(document, 'script') as HTMLScriptElement
        // Simulate the `onload` callback with a valid event object after some delay
        setTimeout(() => {
          script.onload?.(new Event('load'))
        }, delay)
        return script
      }
      return originalCreateElement.call(document, tagName)
    })

    return createElementSpy
  }

  test('Ga sends analytics after script onload', async () => {
    jest.useFakeTimers()
    const createElementSpy = mockScriptLoading(TIME_WAIT_FOR_READY_PLATFORM)

    // Initialize the Ga instance
    const config = { measurementId: GA_MEASUREMENT_ID }
    const instance = Ga.getInstance(config)

    // Initially, the instance should not be ready
    expect(instance.isReady).toBe(false)

    // Simulate sending an event while the script is still loading
    instance.processAnalyticsEvent(mockEvent)

    // Ensure the event is added to the queue
    expect(instance.eventQueue.length).toBe(1)

    // Fast-forward time to simulate the script being loaded
    jest.advanceTimersByTime(TIME_WAIT_FOR_READY_PLATFORM)

    // After script loads, isReady should be true
    expect(instance.isReady).toBe(true)
    // Manually call window.gtag with the mock event
    instance.sendAnalyticsEvent(mockEvent)
    // After script loads, the event should be processed and sent
    expect(window.gtag).toHaveBeenCalledWith('event', mockEvent.eventName, mockEvent.eventParams)
    jest.advanceTimersByTime(TIME_WAIT_FOR_READY_PLATFORM)
    // Ensure the event queue is cleared after processing
    expect(instance.eventQueue.length).toBe(0)

    // Clean up mocks
    createElementSpy.mockRestore()

    // Restore real timers after the test
    jest.useRealTimers()
  })

  test('Meta Sends Analytics', async () => {
    jest.useFakeTimers()
    const createElementSpy = mockScriptLoading(TIME_WAIT_FOR_READY_PLATFORM)

    const config = { measurementId: META_MEASUREMENT_ID }

    // Initialize the Ga instance
    const instance = Meta.getInstance(config)

    // After script loads, isReady should be true
    expect(instance.isReady).toBe(true)
    // Manually call window.gtag with the mock event
    instance.sendAnalyticsEvent(mockEvent)
    // After script loads, the event should be processed and sent
    expect(window.fbq).toHaveBeenCalledWith('event', mockEvent.eventName, mockEvent.eventParams)
    // Ensure the event queue is cleared after processing
    expect(instance.eventQueue.length).toBe(0)

    // Clean up mocks
    createElementSpy.mockRestore()
  })

  test('Tiktok Sends Analytics', async () => {
    jest.useFakeTimers()
    const createElementSpy = mockScriptLoading(TIME_WAIT_FOR_READY_PLATFORM)

    const config = { measurementId: TIKTOK_MEASUREMENT_ID }

    // Initialize the TikTok instance
    const instance = TikTok.getInstance(config)

    jest.advanceTimersByTime(TIME_WAIT_FOR_READY_PLATFORM)

    // After script loads, isReady should be true
    expect(instance.isReady).toBe(true)

    // Manually call window.ttq.track with the mock event
    instance.sendAnalyticsEvent(mockEvent)
    // Ensure the event queue is cleared after processing
    expect(instance.eventQueue.length).toBe(0)

    // Clean up mocks
    createElementSpy.mockRestore()
  })
})
