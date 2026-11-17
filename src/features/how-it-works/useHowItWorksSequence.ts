import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import { howItWorksConfig, WheelGestureGate } from './howItWorksConfig'
import { sectionFromHash, sectionNavigationEvent, type SectionId } from '../scroll/sectionNavigation'

type ScrollSide = 'before' | 'holding' | 'after'

export function useHowItWorksSequence(
  trackRef: RefObject<HTMLElement | null>,
  sceneRef: RefObject<HTMLElement | null>,
  enhanced: boolean,
) {
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [pinned, setPinned] = useState(false)
  const current = useRef(0)
  const animating = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const skip = useRef<() => void>(() => {})
  const skipSequence = useCallback(() => skip.current(), [])

  const selectStep = useCallback((next: number) => {
    if (animating.current || next === current.current) return
    current.current = Math.max(0, Math.min(3, next))
    setStep(current.current)
    if (!enhanced) return
    animating.current = true
    setBusy(true)
    timer.current = setTimeout(() => {
      animating.current = false
      setBusy(false)
    }, howItWorksConfig.duration * 1000 + 50)
  }, [enhanced])

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (!enhanced) return
    const track = trackRef.current
    const scene = sceneRef.current
    if (!track || !scene) return
    const gesture = new WheelGestureGate()
    let top = track.getBoundingClientRect().top + window.scrollY
    let previousY = window.scrollY
    let side: ScrollSide = previousY > top ? 'after' : 'before'
    let lastWheel = -Infinity
    let bypass = Boolean(sectionFromHash() && sectionFromHash() !== 'how-it-works')

    function align() {
      // Уже поставленные браузером в очередь смещения не могут увести захваченную сцену.
      if (Math.abs(window.scrollY - top) > 0.5) window.scrollTo({ top, behavior: 'instant' })
      previousY = top
    }

    function enter(direction: number, fromWheel: boolean) {
      side = 'holding'
      if (fromWheel) gesture.consume(performance.now())
      else gesture.reset()
      clearTimeout(timer.current)
      animating.current = false
      current.current = direction > 0 ? 0 : 3
      // Фиксация и начальный шаг применяются вместе до следующего кадра браузера.
      flushSync(() => {
        setPinned(true)
        setBusy(false)
        setStep(current.current)
      })
      align()
    }

    function release(direction: number) {
      side = direction > 0 ? 'after' : 'before'
      gesture.consume(performance.now())
      gesture.mode = 'released'
      previousY = window.scrollY
      flushSync(() => setPinned(false))
    }

    function measure() {
      // Измеряется постоянный якорь, а не вынесенный в position:fixed контент.
      top = track!.getBoundingClientRect().top + window.scrollY
      if (side === 'holding') align()
    }

    function prepareNavigation(id: SectionId) {
      const target = document.getElementById(id)
      if (!target) return
      if (target === track || track!.contains(target)) {
        bypass = false
        enter(1, false)
        return
      }
      // Якорный переход не является жестом демонстрации: разрешаем пройти её границу.
      bypass = true
      if (side === 'holding') {
        const beforeScene = target.compareDocumentPosition(track!) & Node.DOCUMENT_POSITION_FOLLOWING
        release(beforeScene ? -1 : 1)
      }
    }

    function onSectionNavigation(event: Event) {
      prepareNavigation((event as CustomEvent<SectionId>).detail)
    }

    function onHashChange() {
      const id = sectionFromHash()
      if (!id) return
      prepareNavigation(id)
      // В том числе история браузера: восстанавливаем цель, если scroll уже пересёк сцену.
      if (id !== 'how-it-works') document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }

    function onScroll() {
      const position = window.scrollY
      if (side === 'holding') {
        align()
        return
      }
      const crossedDown = side === 'before' && previousY <= top && position >= top
      const crossedUp = side === 'after' && previousY >= top && position <= top
      const wheelTail = performance.now() - lastWheel <= howItWorksConfig.gestureQuietMs
      if (!bypass && !(gesture.mode === 'released' && wheelTail) && (crossedDown || crossedUp)) {
        enter(crossedDown ? 1 : -1, wheelTail)
        return
      }
      previousY = position
      side = position > top ? 'after' : 'before'
    }

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return
      bypass = false
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1)
      const now = performance.now()
      lastWheel = now
      // Наблюдаем поток ещё до входа, чтобы его инерционный хвост принадлежал входу.
      const direction = gesture.feed(delta, now)
      if (side !== 'holding') {
        const position = window.scrollY
        const crossingDown = side === 'before' && position <= top && delta > 0 && position + delta >= top
        const crossingUp = side === 'after' && position >= top && delta < 0 && position + delta <= top
        if (gesture.mode !== 'released' && (crossingDown || crossingUp) && event.cancelable) {
          event.preventDefault()
          enter(crossingDown ? 1 : -1, true)
        }
        return
      }

      const outward = (current.current === 0 && delta < 0) || (current.current === 3 && delta > 0)
      if (gesture.mode === 'pending' && !animating.current && outward) {
        release(Math.sign(delta))
        return
      }
      if (!event.cancelable) return
      event.preventDefault()
      if (gesture.mode === 'consumed') return
      if (animating.current) {
        gesture.consume(now)
        return
      }
      if (direction) {
        gesture.consume(now)
        selectStep(current.current + direction)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.altKey || event.metaKey) return
      const target = event.target as HTMLElement
      if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      const direction = ['ArrowDown', 'PageDown'].includes(event.key) || (event.key === ' ' && !event.shiftKey)
        ? 1 : ['ArrowUp', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey) ? -1 : 0
      if (event.key === 'Home' || event.key === 'End') {
        bypass = true
        if (side === 'holding') release(event.key === 'End' ? 1 : -1)
        return
      }
      if (side !== 'holding') {
        if (direction) {
          bypass = false
          gesture.reset()
        }
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        bypass = true
        release(1)
        document.getElementById('how-it-works-end')?.focus({ preventScroll: true })
        window.scrollTo({ top: top + track!.offsetHeight, behavior: 'instant' })
        return
      }
      if (event.key === 'Tab') {
        const controls = scene!.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]')
        const leaving = event.shiftKey ? target === controls[0] : target === controls[controls.length - 1]
        if (leaving) {
          bypass = true
          release(event.shiftKey ? -1 : 1)
        }
        return
      }
      // Space сохраняет обычную активацию кнопок; стрелки работают независимо от фокуса.
      if (!direction || (event.key === ' ' && target.closest('button, a[href]'))) return
      event.preventDefault()
      if (event.repeat) return
      if (!animating.current && ((current.current === 0 && direction < 0) || (current.current === 3 && direction > 0))) {
        release(direction)
        window.scrollBy({ top: direction * window.innerHeight * 0.5, behavior: 'instant' })
        return
      }
      selectStep(current.current + direction)
    }

    function onFocusIn(event: FocusEvent) {
      const target = event.target as HTMLElement
      if (side !== 'holding' || track!.contains(target)) return
      // Tab и внешние ссылки могут увести фокус со сцены, не удерживая страницу.
      bypass = true
      const beforeScene = target.compareDocumentPosition(scene!) & Node.DOCUMENT_POSITION_FOLLOWING
      release(beforeScene ? -1 : 1)
    }

    skip.current = () => {
      bypass = true
      if (side === 'holding') release(1)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    observer.observe(document.body)
    // Восстановленный адрес/scroll position тоже проходит через тот же вход.
    const initialFrame = requestAnimationFrame(() => {
      if (!bypass && Math.abs(window.scrollY - top) <= 1) enter(1, false)
    })
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('focusin', onFocusIn)
    window.addEventListener(sectionNavigationEvent, onSectionNavigation)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      cancelAnimationFrame(initialFrame)
      observer.disconnect()
      skip.current = () => {}
      setPinned(false)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('focusin', onFocusIn)
      window.removeEventListener(sectionNavigationEvent, onSectionNavigation)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [enhanced, trackRef, sceneRef, selectStep])

  return { step, busy, pinned, selectStep, skipSequence }
}
