import { useCallback, useRef } from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

/**
 * useCallback() invalidates too often in practice
 * See RFC in https://github.com/reactjs/rfcs/pull/220
 * Inspired by: https://github.com/facebook/react/issues/14099#issuecomment-440013892
 * Related:
 * MUI useCallbackEvent
 * Chakra-ui useCallbackRef
 * ahooks useMemoizedFn
 */
export function useCallbackEvent<Args extends unknown[], Return> (
  callback: (...args: Args) => Return
) {
  const callbackRef = useRef(callback)

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback
  })

  // To avoid undefined function call, we need to cast the function type.
  return useCallback((...args: Args) => callbackRef.current?.(...args), [])
}
