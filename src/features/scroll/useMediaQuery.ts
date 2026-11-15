import { useCallback, useMemo, useSyncExternalStore } from 'react'

// Подписка обновляется только при смене результата media query, а не на каждом resize.
export function useMediaQuery(query: string) {
  const media = useMemo(() => window.matchMedia(query), [query])
  const subscribe = useCallback((notify: () => void) => {
    media.addEventListener('change', notify)
    return () => media.removeEventListener('change', notify)
  }, [media])

  return useSyncExternalStore(subscribe, () => media.matches, () => false)
}
