import { useEffect, useRef, useState, type SVGProps } from 'react'

export function useWheelInteraction(sectorIds: readonly string[]) {
  const rootRef = useRef<HTMLElement>(null)
  const sectorRefs = useRef(new Map<string, SVGGElement>())
  const hoveredId = useRef<string | null>(null)
  const focusedId = useRef<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tabStopId, setTabStopId] = useState(sectorIds[0])

  // Только один сектор входит в обычный порядок Tab. Остальные доступны стрелками.
  const currentTabStop = sectorIds.includes(tabStopId) ? tabStopId : sectorIds[0]

  useEffect(() => {
    function clearOutside(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        hoveredId.current = null
        focusedId.current = null
        setActiveId(null)
      }
    }

    document.addEventListener('pointerdown', clearOutside)
    return () => document.removeEventListener('pointerdown', clearOutside)
  }, [])

  function getSectorProps(id: string): SVGProps<SVGGElement> {
    return {
      ref: (node) => {
        if (node) sectorRefs.current.set(id, node)
        else sectorRefs.current.delete(id)
      },
      tabIndex: id === currentTabStop ? 0 : -1,
      onPointerEnter: (event) => {
        // Touch создаёт pointerenter перед нажатием: не считаем его наведением.
        if (event.pointerType === 'touch') return
        hoveredId.current = id
        setActiveId(id)
      },
      onPointerLeave: (event) => {
        if (event.pointerType === 'touch') return
        hoveredId.current = null
        setActiveId(focusedId.current)
      },
      onFocus: () => {
        focusedId.current = id
        setTabStopId(id)
        setActiveId(id)
      },
      onBlur: () => {
        focusedId.current = null
        setActiveId(hoveredId.current)
      },
      onClick: (event) => {
        // Явный фокус нужен в том числе для SVG-кнопок на сенсорных экранах.
        event.currentTarget.focus({ preventScroll: true })
        focusedId.current = id
        setTabStopId(id)
        setActiveId(id)
      },
      onKeyDown: (event) => {
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
    activeId: activeId && sectorIds.includes(activeId) ? activeId : null,
    getSectorProps,
  }
}
