import { useEffect, useState, type RefObject } from 'react'
import { sectionNavigationEvent } from '../features/scroll/sectionNavigation'

const movementThreshold = 16
const topZone = 24
type Direction = -1 | 1
type ScrollIntent = Direction | 'touch' | 'scrollbar' | null

// Этот наблюдатель никогда не меняет scroll position и не отменяет события ввода.
export function useHeaderVisibility(headerRef: RefObject<HTMLElement | null>, menuOpen: boolean) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const howScene = document.querySelector('.how-scene')
    let previousY = Math.max(0, window.scrollY)
    let intent: ScrollIntent = null
    let direction = 0
    let distance = 0
    let currentHidden = false

    function resetMovement() {
      previousY = Math.max(0, window.scrollY)
      direction = 0
      distance = 0
    }

    function changeVisibility(next: boolean) {
      if (currentHidden === next) return
      currentHidden = next
      setHidden(next)
    }

    function reveal() {
      changeVisibility(false)
      resetMovement()
    }

    function clearIntent() {
      intent = null
      resetMovement()
    }

    function onScrollEnd() {
      intent = null
      // Маленькие движения одного направления складываются и между жестами.
      previousY = Math.max(0, window.scrollY)
    }

    function onScroll() {
      const y = Math.max(0, window.scrollY)
      const delta = y - previousY
      previousY = y

      if (y <= topZone || menuOpen || header!.contains(document.activeElement)) {
        reveal()
        return
      }

      // Коррекции align() внутри How It Works не являются движением по странице.
      if (howScene?.classList.contains('how-scene--pinned')) {
        resetMovement()
        return
      }
      if (Math.abs(delta) < 0.5) return
      const nextDirection = Math.sign(delta)
      if (intent === null || (typeof intent === 'number' && intent !== nextDirection)) {
        resetMovement()
        return
      }
      if (direction !== nextDirection) distance = 0
      direction = nextDirection
      distance = Math.min(movementThreshold, distance + Math.abs(delta))
      if (distance >= movementThreshold) changeVisibility(direction > 0)
    }

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || event.metaKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      intent = event.deltaY > 0 ? 1 : -1
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey) return
      const target = event.target as HTMLElement
      if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (['Home', 'End', 'Escape', 'Tab'].includes(event.key)) {
        clearIntent()
        return
      }
      if (event.key === ' ' && target.closest('button, a[href]')) return
      if (['ArrowDown', 'PageDown'].includes(event.key) || (event.key === ' ' && !event.shiftKey)) intent = 1
      else if (['ArrowUp', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey)) intent = -1
    }

    function onTouchStart() {
      intent = 'touch'
      resetMovement()
    }

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === 'touch') return
      const root = document.documentElement
      intent = event.clientX >= root.clientWidth || event.clientY >= root.clientHeight ? 'scrollbar' : null
      resetMovement()
    }

    function onNavigation() {
      clearIntent()
      reveal()
    }

    function onFocusOut(event: FocusEvent) {
      if (!header!.contains(event.relatedTarget as Node | null)) clearIntent()
    }

    // При открытии/закрытии меню начинаем наблюдение с текущей позиции.
    setHidden(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('scrollend', onScrollEnd)
    window.addEventListener('resize', clearIntent)
    window.addEventListener('blur', clearIntent)
    window.addEventListener(sectionNavigationEvent, onNavigation)
    window.addEventListener('hashchange', onNavigation)
    header.addEventListener('focusin', reveal)
    header.addEventListener('focusout', onFocusOut)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('resize', clearIntent)
      window.removeEventListener('blur', clearIntent)
      window.removeEventListener(sectionNavigationEvent, onNavigation)
      window.removeEventListener('hashchange', onNavigation)
      header.removeEventListener('focusin', reveal)
      header.removeEventListener('focusout', onFocusOut)
    }
  }, [headerRef, menuOpen])

  return hidden
}
