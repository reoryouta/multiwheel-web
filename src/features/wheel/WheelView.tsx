import { motion, useReducedMotion } from 'motion/react'
import { useId, type SVGProps } from 'react'
import { getSectorGeometry, wheelGeometry } from './wheelGeometry'
import { WheelCenter } from './WheelCenter'
import type { WheelAction } from './wheelActions'

type WheelViewProps = {
  actions: readonly (WheelAction & { label: string; accessibleLabel: string })[]
  activeId: string | null
  getSectorProps: (id: string) => SVGProps<SVGGElement>
  title: string
  description: string
  hintId: string
  brand: string
}

export function WheelView({ actions, activeId, getSectorProps, title, description, hintId, brand }: WheelViewProps) {
  const id = useId()
  const shouldReduceMotion = useReducedMotion()
  const duration = shouldReduceMotion ? 0 : 0.14
  const { size, center, centerRadius, outerRingRadius, innerRingRadius } = wheelGeometry
  const activeAction = actions.find((action) => action.id === activeId)

  return (
    <div className="wheel-view relative size-full">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        role="group"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description ${hintId}`}
        className="block size-full"
      >
        <title id={`${id}-title`}>{title}</title>
        <desc id={`${id}-description`}>{description}</desc>
        <defs>
          <linearGradient id={`${id}-surface`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--surface)" />
            <stop offset="100%" stopColor="var(--background)" />
          </linearGradient>
          <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.36" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <g aria-hidden="true" pointerEvents="none">
          <circle cx={center} cy={center} r={outerRingRadius} fill="none" stroke="var(--border)" strokeOpacity="0.5" />
          <circle cx={center} cy={center} r={innerRingRadius} fill="none" stroke="var(--border)" strokeOpacity="0.35" />
        </g>

        {actions.map((action, index) => {
          const { path, iconPosition } = getSectorGeometry(index, actions.length)
          const isActive = action.id === activeId
          const Icon = action.icon

          return (
            <g
              key={action.id}
              {...getSectorProps(action.id)}
              role="button"
              aria-label={action.accessibleLabel}
              aria-describedby={hintId}
              data-sector-id={action.id}
              data-active={isActive}
              className="wheel-sector cursor-pointer outline-none"
            >
              {/* Неподвижная область попадания исключает дрожание на краях при увеличении. */}
              <path d={path} fill="transparent" pointerEvents="all" />
              <motion.g
                aria-hidden="true"
                pointerEvents="none"
                initial={false}
                animate={{ scale: isActive && !shouldReduceMotion ? 1.018 : 1 }}
                transition={{ duration, ease: 'easeOut' }}
                style={{ transformOrigin: `${center}px ${center}px` }}
              >
                <path d={path} fill={`url(#${id}-surface)`} stroke="var(--border)" strokeOpacity="0.8" />
                <motion.path
                  d={path}
                  fill={`url(#${id}-accent)`}
                  stroke="var(--accent)"
                  strokeOpacity="0.55"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration }}
                />
                <motion.g
                  initial={false}
                  animate={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  transition={{ duration }}
                >
                  <Icon x={iconPosition.x - 12} y={iconPosition.y - 12} size={24} strokeWidth={1.5} />
                </motion.g>
              </motion.g>
              <path
                d={path}
                className="wheel-sector-focus"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeDasharray="3 3"
                pointerEvents="none"
                aria-hidden="true"
              />
            </g>
          )
        })}

        <g pointerEvents="none" aria-hidden="true">
          <circle cx={center} cy={center} r={centerRadius} fill="var(--background)" stroke="var(--border)" />
        </g>
      </svg>
      <WheelCenter action={activeAction} brand={brand} />
    </div>
  )
}
