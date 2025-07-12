import { type BaseAnalyticsEvent } from '../types/events'
export const TIME_WAIT_FOR_READY_PLATFORM = 500
export enum AnalyticsPlatforms {
  GA = 'GA',
  META = 'META',
  TIKTOK = 'TIKTOK',
}

export abstract class Analytics<T extends BaseAnalyticsEvent> {
  private _isReady: boolean
  private _eventQueue: T[]

  constructor() {
    this._eventQueue = []
    this._isReady = false
  }

  protected abstract initialize(): void
  protected abstract sendAnalyticsEvent(customEvent: T): void

  protected writeEventsToPlatform(): void {
    if (!this._isReady) {
      window.setTimeout(() => this.writeEventsToPlatform(), TIME_WAIT_FOR_READY_PLATFORM)
      return
    }
    this._eventQueue.forEach((event) => {
      this.sendAnalyticsEvent(event)
    })
    this._eventQueue = []
  }

  public get isReady(): boolean {
    return this._isReady
  }

  public get eventQueue(): T[] {
    return [...this._eventQueue]
  }

  protected setIsReady(value: boolean): void {
    this._isReady = value
  }

  public processAnalyticsEvent(customEvent: T): void {
    this.addToEventQueue(customEvent)
    this.writeEventsToPlatform()
  }

  protected addToEventQueue(customEvent: T): void {
    this._eventQueue.push(customEvent)
  }
}
