import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { type BaseAnalyticsEvent } from '../types/events'
import { Ga } from './Ga'

describe('Google Analytics (GA4)', () => {
  const measurementId = 'GA-TEST-ID'
  const config = { measurementId }

  beforeEach(() => {
    // Arrange: Setup fake timers and clean state
    vi.useFakeTimers()
    window.gtag = undefined
    window.dataLayer = undefined
    document.head.innerHTML = ''
    // @ts-expect-error: override singleton
    Ga.instance = null
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('test_getInstance_multipleCallsSameConfig_returnsSameSingletonInstance', () => {
    it('should return the same singleton instance when called multiple times', () => {
      // Arrange: Config is already set up in beforeEach

      // Act: Get two instances
      const firstInstance = Ga.getInstance(config)
      const secondInstance = Ga.getInstance(config)

      // Assert: Both should be the same instance
      expect(firstInstance).toBe(secondInstance)
    })
  })

  describe('test_initialize_validConfig_injectsGtagScriptIntoDOM', () => {
    it('should inject GA4 script with correct src attribute', () => {
      // Arrange: Clean state ensured by beforeEach

      // Act: Create GA instance
      Ga.getInstance(config)

      // Assert: Script should be injected with correct URL
      const script = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`) as HTMLScriptElement
      expect(script).not.toBeNull()
      expect(script?.async).toBe(true)
    })

    it('should initialize dataLayer array', () => {
      // Arrange: Clean state ensured by beforeEach

      // Act: Create GA instance
      Ga.getInstance(config)

      // Assert: dataLayer should be initialized
      expect(window.dataLayer).toBeDefined()
      expect(Array.isArray(window.dataLayer)).toBe(true)
    })

    it('should initialize gtag function', () => {
      // Arrange: Clean state ensured by beforeEach

      // Act: Create GA instance
      Ga.getInstance(config)

      // Assert: gtag function should be defined
      expect(typeof window.gtag).toBe('function')
    })

    it('should set isReady to true when script loads successfully', () => {
      // Arrange: Create instance
      const ga = Ga.getInstance(config)

      // Act: Simulate script load event
      const script = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`)
      script?.dispatchEvent(new Event('load'))

      // Assert: GA should be ready
      expect(ga.isReady).toBe(true)
    })

    it('should set isReady to true if script already exists in DOM', () => {
      // Arrange: Pre-inject the script
      const existingScript = document.createElement('script')
      existingScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      document.head.appendChild(existingScript)

      // Act: Create GA instance
      const ga = Ga.getInstance(config)

      // Assert: Should recognize existing script and be ready
      expect(ga.isReady).toBe(true)
    })

    it('should not reinitialize gtag if already exists', () => {
      // Arrange: Pre-setup gtag
      const mockGtag = vi.fn()
      window.gtag = mockGtag
      window.dataLayer = []

      // Act: Create GA instance
      Ga.getInstance(config)

      // Assert: gtag should remain the same mock
      expect(window.gtag).toBe(mockGtag)
    })
  })

  describe('test_processAnalyticsEvent_validEvent_sendsEventWhenReady', () => {
    it('should queue and send event when gtag is available and ready', () => {
      // Arrange: Setup GA instance and mock gtag
      const ga = Ga.getInstance(config)
      const mockGtag = vi.fn()
      window.gtag = mockGtag
      ga['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'purchase',
        eventParams: { transaction_id: 'T12345', value: 250.00, currency: 'USD' },
      }

      // Act: Process the event
      ga.processAnalyticsEvent(event)
      vi.advanceTimersByTime(1500)

      // Assert: gtag should be called with correct parameters
      expect(mockGtag).toHaveBeenCalledWith('event', 'purchase', {
        transaction_id: 'T12345',
        value: 250.00,
        currency: 'USD',
      })
      expect(mockGtag).toHaveBeenCalledTimes(1)
    })

    it('should queue event and retry sending when not initially ready', () => {
      // Arrange: Setup GA instance without being ready
      const ga = Ga.getInstance(config)
      const mockGtag = vi.fn()
      window.gtag = mockGtag

      const event: BaseAnalyticsEvent = {
        eventName: 'login',
        eventParams: { method: 'email' },
      }

      // Act: Process event before ready, then set ready and advance timers
      ga.processAnalyticsEvent(event)
      ga['setIsReady'](true)
      vi.advanceTimersByTime(1500)

      // Assert: Event should be sent after retry
      expect(mockGtag).toHaveBeenCalledWith('event', 'login', { method: 'email' })
    })
  })

  describe('test_processAnalyticsEvent_multipleEvents_processesAllInQueue', () => {
    it('should process multiple queued events when platform becomes ready', () => {
      // Arrange: Setup GA instance and multiple events
      const ga = Ga.getInstance(config)
      const mockGtag = vi.fn()
      window.gtag = mockGtag

      const event1: BaseAnalyticsEvent = {
        eventName: 'page_view',
        eventParams: { page_title: 'Home' },
      }
      const event2: BaseAnalyticsEvent = {
        eventName: 'add_to_cart',
        eventParams: { item_id: 'SKU123' },
      }
      const event3: BaseAnalyticsEvent = {
        eventName: 'begin_checkout',
        eventParams: { value: 99.99 },
      }

      // Act: Queue multiple events before ready
      ga.processAnalyticsEvent(event1)
      ga.processAnalyticsEvent(event2)
      ga.processAnalyticsEvent(event3)

      // Set ready and advance time
      ga['setIsReady'](true)
      vi.advanceTimersByTime(1500)

      // Assert: All events should be sent
      expect(mockGtag).toHaveBeenCalledTimes(3)
      expect(mockGtag).toHaveBeenNthCalledWith(1, 'event', 'page_view', { page_title: 'Home' })
      expect(mockGtag).toHaveBeenNthCalledWith(2, 'event', 'add_to_cart', { item_id: 'SKU123' })
      expect(mockGtag).toHaveBeenNthCalledWith(3, 'event', 'begin_checkout', { value: 99.99 })
    })
  })

  describe('test_processAnalyticsEvent_gtagUndefined_handlesGracefully', () => {
    it('should not throw error when gtag is undefined', () => {
      // Arrange: Setup GA instance without gtag
      const ga = Ga.getInstance(config)
      window.gtag = undefined
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      ga['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'purchase',
        eventParams: { value: 100 },
      }

      // Act & Assert: Should not throw
      expect(() => {
        ga.processAnalyticsEvent(event)
        vi.advanceTimersByTime(1500)
      }).not.toThrow()

      // Assert: Error should be logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('[GA] gtag is not defined')

      // Cleanup
      consoleErrorSpy.mockRestore()
    })
  })

  describe('test_processAnalyticsEvent_emptyEventParams_sendsEventWithoutParams', () => {
    it('should send event with empty params object', () => {
      // Arrange: Setup GA instance
      const ga = Ga.getInstance(config)
      const mockGtag = vi.fn()
      window.gtag = mockGtag
      ga['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'page_view',
        eventParams: {},
      }

      // Act: Process event with empty params
      ga.processAnalyticsEvent(event)
      vi.advanceTimersByTime(1500)

      // Assert: Should send with empty object
      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {})
    })
  })

  describe('test_initialize_dataLayerPreexists_preservesExistingDataLayer', () => {
    it('should preserve existing dataLayer when already initialized', () => {
      // Arrange: Pre-initialize dataLayer with data
      const existingData = { event: 'pre_existing' }
      window.dataLayer = [existingData]

      // Act: Create GA instance
      Ga.getInstance(config)

      // Assert: Existing data should be preserved
      expect(window.dataLayer).toContain(existingData)
      expect(window.dataLayer.length).toBeGreaterThan(0)
    })
  })

  describe('test_processAnalyticsEvent_complexEventParams_sendsAllParameters', () => {
    it('should handle complex nested event parameters', () => {
      // Arrange: Setup GA instance
      const ga = Ga.getInstance(config)
      const mockGtag = vi.fn()
      window.gtag = mockGtag
      ga['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'purchase',
        eventParams: {
          transaction_id: 'T12345',
          value: 99.99,
          currency: 'USD',
          items: [
            { id: 'SKU1', name: 'Product 1', quantity: 2 },
            { id: 'SKU2', name: 'Product 2', quantity: 1 },
          ],
        },
      }

      // Act: Process event with complex params
      ga.processAnalyticsEvent(event)
      vi.advanceTimersByTime(1500)

      // Assert: Should send all parameters
      expect(mockGtag).toHaveBeenCalledWith('event', 'purchase', {
        transaction_id: 'T12345',
        value: 99.99,
        currency: 'USD',
        items: [
          { id: 'SKU1', name: 'Product 1', quantity: 2 },
          { id: 'SKU2', name: 'Product 2', quantity: 1 },
        ],
      })
    })
  })

  describe('test_eventQueue_getter_returnsImmutableCopy', () => {
    it('should return a copy of event queue without exposing internal state', () => {
      // Arrange: Setup GA instance and add event
      const ga = Ga.getInstance(config)
      const event: BaseAnalyticsEvent = {
        eventName: 'test_event',
        eventParams: {},
      }

      // Act: Get event queue before and after adding event
      const queueBefore = ga.eventQueue
      ga['addToEventQueue'](event)
      const queueAfter = ga.eventQueue

      // Assert: Queue should be a copy (different reference)
      expect(queueBefore).not.toBe(queueAfter)
      expect(queueBefore.length).toBe(0)
      expect(queueAfter.length).toBe(1)
    })
  })

  describe('test_initialize_differentMeasurementIds_usesCorrectId', () => {
    it('should use correct measurement ID in script URL', () => {
      // Arrange: Custom measurement ID
      const customId = 'G-CUSTOM123'
      const customConfig = { measurementId: customId }

      // @ts-expect-error: reset singleton
      Ga.instance = null

      // Act: Create instance with custom ID
      Ga.getInstance(customConfig)

      // Assert: Script should use custom measurement ID
      const script = document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${customId}"]`)
      expect(script).not.toBeNull()
    })
  })

  describe('test_processAnalyticsEvent_specialCharactersInEventName_handlesCorrectly', () => {
    it('should handle event names with underscores and lowercase', () => {
      // Arrange: Setup GA instance
      const ga = Ga.getInstance(config)
      const mockGtag = vi.fn()
      window.gtag = mockGtag
      ga['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'custom_user_action_2024',
        eventParams: { category: 'engagement' },
      }

      // Act: Process event
      ga.processAnalyticsEvent(event)
      vi.advanceTimersByTime(1500)

      // Assert: Should send event name as-is
      expect(mockGtag).toHaveBeenCalledWith('event', 'custom_user_action_2024', {
        category: 'engagement',
      })
    })
  })

  describe('test_processAnalyticsEvent_boundaryValues_handlesCorrectly', () => {
    it('should handle zero value in event parameters', () => {
      // Arrange: Setup GA instance
      const ga = Ga.getInstance(config)
      const mockGtag = vi.fn()
      window.gtag = mockGtag
      ga['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'purchase',
        eventParams: { value: 0, currency: 'USD' },
      }

      // Act: Process event with zero value
      ga.processAnalyticsEvent(event)
      vi.advanceTimersByTime(1500)

      // Assert: Should send zero value
      expect(mockGtag).toHaveBeenCalledWith('event', 'purchase', {
        value: 0,
        currency: 'USD',
      })
    })

    it('should handle very large values in event parameters', () => {
      // Arrange: Setup GA instance
      const ga = Ga.getInstance(config)
      const mockGtag = vi.fn()
      window.gtag = mockGtag
      ga['setIsReady'](true)

      const event: BaseAnalyticsEvent = {
        eventName: 'purchase',
        eventParams: { value: 999999.99, quantity: 1000000 },
      }

      // Act: Process event with large values
      ga.processAnalyticsEvent(event)
      vi.advanceTimersByTime(1500)

      // Assert: Should send large values
      expect(mockGtag).toHaveBeenCalledWith('event', 'purchase', {
        value: 999999.99,
        quantity: 1000000,
      })
    })
  })
})
