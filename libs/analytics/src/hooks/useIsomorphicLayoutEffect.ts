import { useEffect, useLayoutEffect } from 'react'

/**
 * Custom hook that support useLayoutEffect in server side to avoid warning.
 * https://medium.com/@alexandereardon/uselayouteffect-and-ssr-192986cdcf7a
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
