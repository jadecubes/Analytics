import { type EffectCallback, useEffect } from 'react'

export function useEffectOnce (effect: EffectCallback) {
  // REF: https://github.dev/streamich/react-use
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
