import { useEffect, useRef, useState, type SVGProps } from 'react'

export function useWheelInteraction(sectorIds: readonly string[], enabled = true) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sectorRefs = useRef(new Map<string, SVGGElement>())
  const hoveredId = useRef<string | null>(null)
  const focusedId = useRef<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tabStopId, setTabStopId] = useState(sectorIds[0])

  // При отключении снимаем выбор до обновления DOM, сохраняя позицию Tab.
  if (!enabled && activeId !== null) setActiveId(null)

  // Только один сектор входит в обычный порядок Tab. Остальные доступны стрелками.
  const currentTabStop = sectorIds.includes(tabStopId) ? tabStopId : sectorIds[0]

  useEffect(() => {
    if (enabled) return
    hoveredId.current = null
    focusedId.current = null
    const element = document.activeElement
    if (element instanceof SVGElement && rootRef.current?.contains(element)) element.blur()
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    function clearOutside(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        hoveredId.current = null
        focusedId.current = null
        setActiveId(null)
      }
    }

    document.addEventListener('pointerdown', clearOutside)
    return () => document.removeEventListener('pointerdown', clearOutside)
  }, [enabled])

  function getSectorProps(id: string): SVGProps<SVGGElement> {
    return {
      ref: (node) => {
        if (node) sectorRefs.current.set(id, node)
        else sectorRefs.current.delete(id)
      },
      tabIndex: enabled && id === currentTabStop ? 0 : -1,
      onPointerEnter: (event) => {
        // Touch создаёт pointerenter перед нажатием: не считаем его наведением.
        if (!enabled || event.pointerType === 'touch') return
        hoveredId.current = id
        setActiveId(id)
      },
      onFocus: () => {
        if (!enabled) return
        focusedId.current = id
        setTabStopId(id)
        setActiveId(id)
      },
      onBlur: () => {
        focusedId.current = null
        setActiveId(hoveredId.current)
      },
      onClick: (event) => {
        if (!enabled) return
        // Явный фокус нужен в том числе для SVG-кнопок на сенсорных экранах.
        event.currentTarget.focus({ preventScroll: true })
        focusedId.current = id
        setTabStopId(id)
        setActiveId(id)
      },
      onKeyDown: (event) => {
        if (!enabled) return
        if (event.key === 'Escape') {
          event.preventDefault()
          hoveredId.current = null
          focusedId.current = null
          setActiveId(null)
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          focusedId.current = id
          setActiveId(id)
          return
        }

        const index = sectorIds.indexOf(id)
        let nextIndex: number

        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            nextIndex = (index + 1) % sectorIds.length
            break
          case 'ArrowLeft':
          case 'ArrowUp':
            nextIndex = (index - 1 + sectorIds.length) % sectorIds.length
            break
          case 'Home':
            nextIndex = 0
            break
          case 'End':
            nextIndex = sectorIds.length - 1
            break
          default:
            return
        }

        event.preventDefault()
        const nextId = sectorIds[nextIndex]
        sectorRefs.current.get(nextId)?.focus({ preventScroll: true })
        focusedId.current = nextId
        setActiveId(nextId)
      },
    }
  }

  return {
    rootRef,
    activeId: enabled && activeId && sectorIds.includes(activeId) ? activeId : null,
    // A visual gap is still inside the working ring. Only leaving the entire
    // ring (including its inner edge) restores the keyboard/touch selection.
    ringProps: {
      onPointerLeave: (event) => {
        if (!enabled || event.pointerType === 'touch') return
        hoveredId.current = null
        setActiveId(focusedId.current)
      },
    } satisfies SVGProps<SVGGElement>,
    getSectorProps,
  }
}
