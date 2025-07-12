declare let fbq: MetaPixel.Event

declare namespace MetaPixel {

  /**
   * Interface of an event object used in lists for this event.
   *
   * Reference:
   * @see {@link https://developers.facebook.com/docs/meta-pixel/reference reference}
   */
  interface EventParams {
    /**
     Either product or product_group based on the content_ids or contents being passed.
     If the IDs being passed in content_ids or contents parameter are IDs of products, then the value should be product.
     If product group IDs are being passed, then the value should be product_group.
     If no content_type is provided, Meta will match the event to every item that has the same ID, independent of its type.
    */
    content_type: 'product' | 'product_group'
    /**
    Product IDs associated with the event, such as SKUs (e.g. ['ABC123', 'XYZ789']).
     */
    content_ids: string[]
    /**
     *
     Name of the page/product.
     */
    content_name: string
    /**
     * Category of the page/product.
     */
    content_category: string
    currency: string
    value: number
    status: boolean
    search_string: string
    contents: {
      id: string
      quantity: number
    }[]
    num_items: number
  }

  interface Event {
    (eventType: string, InitialAppId: string): void
    (
      eventType: string,
      InitialAppId: string,
      eventName: string,
      parameters:
        | ViewContentParameters
        | SearchParameters
        | AddToCartParameters
        | AddToWishlistParameters
        | InitiateCheckoutParameters
        | AddPaymentInfoParameters
        | PurchaseParameters
        | LeadParameters
        | CompleteRegistrationParameters
        | CustomParameters,
      option?: EventIDOptions
    ): void

    (eventType: string, eventName: string): void
    (
      eventType: string,
      eventName: string,
      parameters: MetaPixel.ViewContentParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: ViewContentParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: SearchParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: AddToCartParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: AddToWishlistParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: InitiateCheckoutParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: AddPaymentInfoParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: PurchaseParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: LeadParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: CompleteRegistrationParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: CustomParameters,
      option?: EventIDOptions
    ): void

    (
      eventType: string,
      eventName: string,
      parameters: MetaPixel.DPA.AddToCartParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: MetaPixel.DPA.PurchaseParameters,
      option?: EventIDOptions
    ): void
    (
      eventType: string,
      eventName: string,
      parameters: MetaPixel.DPA.ViewContentParameters,
      option?: EventIDOptions
    ): void
  }

  interface ViewContentParameters {
    content_ids: EventParams['content_ids']
    content_type?: EventParams['content_type']
    contents: EventParams['contents']
    currency: EventParams['currency']
    value: EventParams['value']
  }

  interface SearchParameters {
    value?: EventParams['value']
    currency?: EventParams['currency']
    content_category?: EventParams['content_category']
    content_ids?: EventParams['content_ids']
    search_string?: EventParams['search_string']
  }

  interface AddToCartParameters {
    content_ids: EventParams['content_ids']
    content_type: EventParams['content_type']
    contents: EventParams['contents']
    currency: EventParams['currency']
    value: EventParams['value']
    content_name: EventParams['content_name']
  }

  interface AddToWishlistParameters {
    value?: EventParams['value']
    currency?: EventParams['currency']
    content_name?: EventParams['content_name']
    content_category?: EventParams['content_category']
    content_ids?: EventParams['content_ids']
  }

  interface InitiateCheckoutParameters {
    content_ids: EventParams['content_ids']
    contents: EventParams['contents']
    currency: EventParams['currency']
    num_items?: EventParams['num_items']
    value: EventParams['value']
  }

  interface AddPaymentInfoParameters {
    value?: EventParams['value']
    currency?: EventParams['currency']
    content_category?: EventParams['content_category']
    content_ids?: EventParams['content_ids']
  }

  interface PurchaseParameters {
    content_ids: EventParams['content_ids']
    content_type?: EventParams['content_type']
    contents: EventParams['contents']
    currency: EventParams['currency']
    num_items?: EventParams['num_items']
    value: EventParams['value']
  }

  interface LeadParameters {
    value?: EventParams['value']
    currency?: EventParams['currency']
    content_name?: EventParams['content_name']
    content_category?: EventParams['content_category']
  }

  interface CompleteRegistrationParameters {
    value?: EventParams['value']
    currency?: EventParams['currency']
    content_name?: EventParams['content_name']
    status?: EventParams['status']
  }

  type CustomParameters = Record<string, unknown>

  interface EventIDOptions {
    eventID: string
  }
}

// For Facebook Tag API using Dynamic Product Ads
declare namespace MetaPixel.DPA {
  interface ViewContentParameters extends MetaPixel.ViewContentParameters {
    content_type: EventParams['content_type']
    content_ids: EventParams['content_ids']
  }

  interface AddToCartParameters extends MetaPixel.AddToCartParameters {
    content_type: EventParams['content_type']
    content_ids: EventParams['content_ids']
  }

  interface PurchaseParameters extends MetaPixel.PurchaseParameters {
    content_type: EventParams['content_type']
    content_ids: EventParams['content_ids']
  }
}
