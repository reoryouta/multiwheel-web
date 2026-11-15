import type { LucideIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useId } from 'react'

type ProfileSwitcherProps = {
  profiles: readonly { id: string; name: string; icon: LucideIcon }[]
  selectedId: string
  onSelect: (id: string) => void
  label: string
  controlsId: string
}

export function ProfileSwitcher({ profiles, selectedId, onSelect, label, controlsId }: ProfileSwitcherProps) {
  const selectionId = useId()
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      role="group"
      aria-label={label}
      className="mx-auto grid w-fit max-w-full grid-cols-2 gap-1 rounded-control border border-border bg-surface/60 p-1 sm:grid-cols-4"
    >
      {profiles.map(({ id, name, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={selectedId === id}
          aria-controls={controlsId}
          onClick={() => onSelect(id)}
          className="relative isolate flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-medium whitespace-nowrap text-secondary hover:text-primary aria-pressed:text-primary"
        >
          {selectedId === id && (
            <motion.span
              aria-hidden="true"
              layoutId={selectionId}
              initial={false}
              transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: 'easeOut' }}
              className="absolute inset-0 -z-10 rounded-md bg-accent/20"
            />
          )}
          <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
          {name}
        </button>
      ))}
    </div>
  )
}
