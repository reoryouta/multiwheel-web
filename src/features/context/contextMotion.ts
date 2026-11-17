import { microMotion } from '../../lib/microMotion'

export const contextMotion = {
  entranceDuration: 0.3,
  reducedEntranceDuration: microMotion.hover,
  entranceEase: 'easeOut' as const,
  stagger: 0.1,
  offset: 12,
  wheelScale: 0.82,
  viewport: { amount: 0.2 },
  crossfade: { duration: 0.32, ease: microMotion.ease },
} as const
