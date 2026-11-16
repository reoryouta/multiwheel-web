import { useSyncExternalStore, type CSSProperties } from 'react'

// Общий характер небольших откликов. Длительности Motion заданы в секундах.
export const microMotion = {
  ease: [0.2, 0, 0, 1] as [number, number, number, number],
  hover: 0.14,
  press: 0.1,
  selection: 0.22,
  textOut: 0.1,
  textIn: 0.14,
}

export const microControlStyle = {
  '--micro-hover-duration': `${microMotion.hover}s`,
  '--micro-ease': `cubic-bezier(${microMotion.ease.join(', ')})`,
  outlineOffset: 2,
} as CSSProperties

export function controlTransitions(reduceMotion: boolean) {
  return {
    color: { duration: reduceMotion ? 0 : microMotion.hover, ease: microMotion.ease },
    scale: { duration: reduceMotion ? 0 : microMotion.press, ease: microMotion.ease },
  }
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function subscribeToMotionPreference(notify: () => void) {
  const media = window.matchMedia(reducedMotionQuery)
  media.addEventListener('change', notify)
  return () => media.removeEventListener('change', notify)
}

export function useMotionPreference() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  )
}
