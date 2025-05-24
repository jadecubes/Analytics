type DataLayerEvent = string | Date | Record<string, unknown> | unknown[]
interface Window {
  dataLayer: unknown[] | undefined,
  gtag: ((...args: unknown[]) => void) | undefined,
  fbq: ((...args: unknwon[]) => void) | undefined,
  ttq: {
    track: ((event: string, payload?: unknown) => void) | undefined,
    push: ((args: unknown[]) => void) | undefined,
    page: (() => void) | undefined,
    load: ((measurementId: string) => void) | undefined,
  } | undefined,
}
