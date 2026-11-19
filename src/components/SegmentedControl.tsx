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
  // Для однострочного grid с p-1 / gap-1: подложка движется только по локальной оси X.
  highlightMode?: 'shared' | 'horizontal'
}

export function SegmentedControl({ items, selectedId, onSelect, label, controlsId, className, buttonClassName, highlightMode = 'shared' }: SegmentedControlProps) {
  const selectionId = useId()
  const reduceMotion = useMotionPreference()
  const horizontal = highlightMode === 'horizontal'
  const selectedIndex = Math.max(0, items.findIndex(({ id }) => id === selectedId))

  return (
    <div role="group" aria-label={label} className={`${className}${horizontal ? ' relative isolate' : ''}`} data-selection-group={selectionId}>
      {horizontal && items.length > 0 && (
        <motion.span
          aria-hidden="true"
          data-selection-highlight=""
          initial={false}
          animate={{ x: `calc(${selectedIndex * 100}% + ${selectedIndex * 0.25}rem)` }}
          transition={{ duration: reduceMotion ? 0 : microMotion.selection, ease: microMotion.ease }}
          style={{ width: `calc((100% - 0.5rem - ${(items.length - 1) * 0.25}rem) / ${items.length})` }}
          className="pointer-events-none absolute inset-y-1 left-1 -z-10 rounded-md bg-accent/20"
        />
      )}
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
          {!horizontal && selectedId === id && (
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
