import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { type BaseAnalyticsEvent } from '../types/events'
import { TikTok } from './Tiktok'

describe('TikTok Analytics', () => {
  const measurementId = 'TT-TEST-ID'
  const config = { measurementId }

  beforeEach(() => {
    // Arrange: Setup fake timers and clean state
    vi.useFakeTimers()
    window.ttq = undefined
    document.head.innerHTML = ''
    // @ts-expect-error: override singleton for test
    TikTok.instance = null
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('test_getInstance_multipleCallsSameConfig_returnsSameSingletonInstance', () => {
    it('should return the same singleton instance when called multiple times', () => {
      // Arrange: Config is already set up in beforeEach

      // Act: Get two instances
      const firstInstance = TikTok.getInstance(config)
      const secondInstance = TikTok.getInstance(config)

      // Assert: Both should be the same instance
      expect(firstInstance).toBe(secondInstance)
    })
  })

  describe('test_initialize_validConfig_injectsTikTokScriptIntoDOM', () => {
    it('should inject TikTok pixel script with correct data-id attribute', () => {
      // Arrange: Clean state ensured by beforeEach

      // Act: Create TikTok instance
      const tiktok = TikTok.getInstance(config)

      // Assert: Script should be injected with correct data-id
      const script = document.querySelector(`script[data-id="tiktok-pixel-${measurementId}"]`)
      expect(script).not.toBeNull()
      expect(script?.textContent).toContain(measurementId)
      expect(script?.textContent).toContain('analytics.tiktok.com')
    })

    it('should set isReady to true when script loads successfully', () => {
      // Arrange: Create instance
      const tiktok = TikTok.getInstance(config)

      // Act: Simulate script load event
      const script = document.querySelector(`script[data-id="tiktok-pixel-${measurementId}"]`)
      script?.dispatchEvent(new Event('load'))

      // Assert: TikTok should be ready
      expect(tiktok.isReady).toBe(true)
    })

    it('should set isReady to true if script already exists in DOM', () => {
      // Arrange: Pre-inject the script
      const existingScript = document.createElement('script')
      existingScript.setAttribute('data-id', `tiktok-pixel-${measurementId}`)
      document.head.appendChild(existingScript)

      // Act: Create TikTok instance
      const tiktok = TikTok.getInstance(config)

      // Assert: Should recognize existing script and be ready
      expect(tiktok.isReady).toBe(true)
    })
  })

  describe('test_processAnalyticsEvent_validEvent_sendsEventWhenReady', () => {
    it('should queue and send event when ttq is available and ready', () => {
      // Arrange: Setup TikTok instance and mock ttq
      const tiktok = TikTok.getInstance(config)
      const mockTtq = {
        track: vi.fn(),
        push: vi.fn(),
        page: vi.fn(),
        load: vi.fn(),
      }
      window.ttq = mockTtq
      tiktok['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'CompletePayment',
        eventParams: { value: 99.99, currency: 'USD' },
      }

      // Act: Process the event
      tiktok.processAnalyticsEvent(event)
      vi.advanceTimersByTime(1500)

      // Assert: ttq.track should be called with correct parameters
      expect(mockTtq.track).toHaveBeenCalledWith('CompletePayment', {
        value: 99.99,
        currency: 'USD',
      })
      expect(mockTtq.track).toHaveBeenCalledTimes(1)
    })

    it('should queue event and retry sending when not initially ready', () => {
      // Arrange: Setup TikTok instance without being ready
      const tiktok = TikTok.getInstance(config)
      const mockTtq = {
        track: vi.fn(),
        push: vi.fn(),
        page: vi.fn(),
        load: vi.fn(),
      }
      window.ttq = mockTtq

      const event: BaseAnalyticsEvent = {
        eventName: 'ViewContent',
        eventParams: { content_id: '12345' },
      }

      // Act: Process event before ready, then set ready and advance timers
      tiktok.processAnalyticsEvent(event)
      tiktok['setIsReady'](true)
      vi.advanceTimersByTime(1500)

      // Assert: Event should be sent after retry
      expect(mockTtq.track).toHaveBeenCalledWith('ViewContent', {
        content_id: '12345',
      })
    })
  })

  describe('test_processAnalyticsEvent_multipleEvents_processesAllInQueue', () => {
    it('should process multiple queued events when platform becomes ready', () => {
      // Arrange: Setup TikTok instance and multiple events
      const tiktok = TikTok.getInstance(config)
      const mockTtq = {
        track: vi.fn(),
        push: vi.fn(),
        page: vi.fn(),
        load: vi.fn(),
      }
      window.ttq = mockTtq

      const event1: BaseAnalyticsEvent = {
        eventName: 'ViewContent',
        eventParams: { content_type: 'product' },
      }
      const event2: BaseAnalyticsEvent = {
        eventName: 'AddToCart',
        eventParams: { content_id: 'SKU123' },
      }
      const event3: BaseAnalyticsEvent = {
        eventName: 'InitiateCheckout',
        eventParams: { value: 150 },
      }

      // Act: Queue multiple events before ready
      tiktok.processAnalyticsEvent(event1)
      tiktok.processAnalyticsEvent(event2)
      tiktok.processAnalyticsEvent(event3)

      // Set ready and advance time
      tiktok['setIsReady'](true)
      vi.advanceTimersByTime(1500)

      // Assert: All events should be sent
      expect(mockTtq.track).toHaveBeenCalledTimes(3)
      expect(mockTtq.track).toHaveBeenNthCalledWith(1, 'ViewContent', { content_type: 'product' })
      expect(mockTtq.track).toHaveBeenNthCalledWith(2, 'AddToCart', { content_id: 'SKU123' })
      expect(mockTtq.track).toHaveBeenNthCalledWith(3, 'InitiateCheckout', { value: 150 })
    })
  })

  describe('test_processAnalyticsEvent_ttqUndefined_handlesGracefully', () => {
    it('should not throw error when ttq is undefined', () => {
      // Arrange: Setup TikTok instance without ttq
      const tiktok = TikTok.getInstance(config)
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      tiktok['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'Purchase',
        eventParams: { value: 100 },
      }

      // Act & Assert: Should not throw
      expect(() => {
        tiktok.processAnalyticsEvent(event)
        vi.advanceTimersByTime(1500)
      }).not.toThrow()

      // Assert: Error should be logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('[TT] ttq is not defined')

      // Cleanup
      consoleErrorSpy.mockRestore()
    })
  })

  describe('test_processAnalyticsEvent_ttqTrackUndefined_handlesGracefully', () => {
    it('should handle gracefully when ttq.track is undefined', () => {
      // Arrange: Setup TikTok instance with ttq but without track method
      const tiktok = TikTok.getInstance(config)
      const mockTtq = {
        push: vi.fn(),
        page: vi.fn(),
        load: vi.fn(),
      }
      window.ttq = mockTtq as any
      tiktok['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'Purchase',
        eventParams: { value: 100 },
      }

      // Act: Process event
      tiktok.processAnalyticsEvent(event)
      vi.advanceTimersByTime(1500)

      // Assert: Should not crash, track method is optional
      expect(tiktok.isReady).toBe(true)
    })
  })

  describe('test_processAnalyticsEvent_emptyEventParams_sendsEventWithoutParams', () => {
    it('should send event with empty params object', () => {
      // Arrange: Setup TikTok instance
      const tiktok = TikTok.getInstance(config)
      const mockTtq = {
        track: vi.fn(),
        push: vi.fn(),
        page: vi.fn(),
        load: vi.fn(),
      }
      window.ttq = mockTtq
      tiktok['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'PageView',
        eventParams: {},
      }

      // Act: Process event with empty params
      tiktok.processAnalyticsEvent(event)
      vi.advanceTimersByTime(1500)

      // Assert: Should send with empty object
      expect(mockTtq.track).toHaveBeenCalledWith('PageView', {})
    })
  })

  describe('test_processAnalyticsEvent_specialCharactersInEventName_handlesCorrectly', () => {
    it('should handle event names with special characters', () => {
      // Arrange: Setup TikTok instance
      const tiktok = TikTok.getInstance(config)
      const mockTtq = {
        track: vi.fn(),
        push: vi.fn(),
        page: vi.fn(),
        load: vi.fn(),
      }
      window.ttq = mockTtq
      tiktok['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'Custom_Event-2024',
        eventParams: { test: 'value' },
      }

      // Act: Process event with special characters
      tiktok.processAnalyticsEvent(event)
      vi.advanceTimersByTime(1500)

      // Assert: Should send event as-is
      expect(mockTtq.track).toHaveBeenCalledWith('Custom_Event-2024', { test: 'value' })
    })
  })

  describe('test_eventQueue_getter_returnsImmutableCopy', () => {
    it('should return a copy of event queue without exposing internal state', () => {
      // Arrange: Setup TikTok instance and add event
      const tiktok = TikTok.getInstance(config)
      const event: BaseAnalyticsEvent = {
        eventName: 'Test',
        eventParams: {},
      }

      // Act: Get event queue before and after adding event
      const queueBefore = tiktok.eventQueue
      tiktok['addToEventQueue'](event)
      const queueAfter = tiktok.eventQueue

      // Assert: Queue should be a copy (different reference)
      expect(queueBefore).not.toBe(queueAfter)
      expect(queueBefore.length).toBe(0)
      expect(queueAfter.length).toBe(1)
    })
  })

  describe('test_initialize_differentMeasurementIds_createsUniqueScripts', () => {
    it('should use measurement ID in script data-id attribute', () => {
      // Arrange: Different measurement IDs
      const customId = 'CUSTOM-TT-ID-123'
      const customConfig = { measurementId: customId }

      // @ts-expect-error: reset singleton
      TikTok.instance = null

      // Act: Create instance with custom ID
      TikTok.getInstance(customConfig)

      // Assert: Script should have custom ID in data-id
      const script = document.querySelector(`script[data-id="tiktok-pixel-${customId}"]`)
      expect(script).not.toBeNull()
      expect(script?.textContent).toContain(customId)
    })
  })
})
