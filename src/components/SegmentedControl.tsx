import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useId } from 'react'
import { controlTransitions, microControlStyle, microMotion, useMotionPreference } from '../lib/microMotion'

type SegmentedControlProps = {
  items: readonly { id: string; label: string; accessibleLabel?: string; lang?: string; icon?: LucideIcon }[]
  selectedId: string
  onSelect: (id: string) => void
  label: string
  controlsId?: string
  className: string
  buttonClassName: string
}

export function SegmentedControl({ items, selectedId, onSelect, label, controlsId, className, buttonClassName }: SegmentedControlProps) {
  const selectionId = useId()
  const reduceMotion = useMotionPreference()

  return (
    <div role="group" aria-label={label} className={className} data-selection-group={selectionId}>
      {items.map(({ id, label: itemLabel, accessibleLabel, lang, icon: Icon }) => (
        <motion.button
          key={id}
          type="button"
          lang={lang}
          aria-label={accessibleLabel}
          aria-pressed={selectedId === id}
          aria-controls={controlsId}
          onClick={() => onSelect(id)}
          initial={false}
          animate={{ color: selectedId === id ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          whileHover={{ color: 'var(--text-primary)' }}
          whileFocus={{ color: 'var(--text-primary)' }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          transition={controlTransitions(reduceMotion)}
          style={microControlStyle}
          className={`micro-control relative isolate flex cursor-pointer items-center justify-center rounded-md text-xs font-medium ${buttonClassName}`}
        >
          {selectedId === id && (
            <motion.span
              aria-hidden="true"
              data-selection-highlight=""
              layoutId={reduceMotion ? undefined : selectionId}
              initial={false}
              transition={{ duration: reduceMotion ? 0 : microMotion.selection, ease: microMotion.ease }}
              className="pointer-events-none absolute inset-0 -z-10 rounded-md bg-accent/20"
            />
          )}
          {Icon && <Icon size={14} strokeWidth={1.5} aria-hidden="true" />}
          {itemLabel}
        </motion.button>
      ))}
    </div>
  )
}
