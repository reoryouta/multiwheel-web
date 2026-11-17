import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { contextMotion } from './contextMotion'

export function ContextCrossfade({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={contextMotion.crossfade}
      aria-hidden={!active}
      inert={!active}
      data-context-active={active}
      style={{ pointerEvents: active ? 'auto' : 'none' }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  )
}
