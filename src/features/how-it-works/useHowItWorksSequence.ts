import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import { howItWorksConfig, WheelGestureGate } from './howItWorksConfig'
import { sectionFromHash, sectionNavigationEvent, type SectionId } from '../scroll/sectionNavigation'
import { getNavigationState, subscribeNavigation } from '../scroll/directNavigation'

type ScrollSide = 'before' | 'holding' | 'after'
type NativeWheelScroll = { min: number; max: number; target: number; direction: number }

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
    let keyboardScroll = false
    let nativeWheelScroll: NativeWheelScroll | undefined
    let bypass = getNavigationState().active || Boolean(sectionFromHash())

    function align() {
      // Коррекция разрешена только для входа, layout и незавершённого wheel-смещения.
      if (Math.abs(window.scrollY - top) > 0.5) window.scrollTo({ top, behavior: 'instant' })
      previousY = top
    }

    function enter(direction: number, fromWheel: boolean) {
      if (fromWheel) keyboardScroll = false
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
      keyboardScroll = false
      side = direction > 0 ? 'after' : 'before'
      gesture.release(direction, performance.now())
      previousY = window.scrollY
      flushSync(() => setPinned(false))
    }

    function leaveForNavigation(position = window.scrollY) {
      // Нативная навигация владеет позицией страницы. Не возвращаем её к якорю.
      bypass = true
      keyboardScroll = false
      nativeWheelScroll = undefined
      gesture.reset()
      clearTimeout(timer.current)
      animating.current = false
      current.current = 0
      side = position > top ? 'after' : 'before'
      previousY = position
      flushSync(() => {
        setPinned(false)
        setBusy(false)
        setStep(0)
      })
    }

    function rememberNativeWheel(position: number, delta: number) {
      // Один wheel порождает несколько scroll-кадров. Сохраняем весь ожидаемый путь,
      // включая накопленные смещения, которые браузер ещё не успел применить.
      const direction = Math.sign(delta)
      const previous = nativeWheelScroll?.direction === direction ? nativeWheelScroll : undefined
      const target = (previous?.target ?? position) + delta
      nativeWheelScroll = {
        min: Math.min(previous?.min ?? position, position, target),
        max: Math.max(previous?.max ?? position, position, target),
        target,
        direction,
      }
    }

    function isNativeWheelScroll(position: number) {
      return !bypass && nativeWheelScroll !== undefined
        && position >= nativeWheelScroll.min - 0.5 && position <= nativeWheelScroll.max + 0.5
    }

    function measure() {
      // Измеряется постоянный якорь, а не вынесенный в position:fixed контент.
      top = track!.getBoundingClientRect().top + window.scrollY
      if (side === 'holding') {
        if (Math.abs(window.scrollY - previousY) > 0.5 && !isNativeWheelScroll(window.scrollY)) leaveForNavigation()
        else align()
      }
    }

    function prepareNavigation(id: SectionId) {
      const target = document.getElementById(id)
      if (!target) return
      if (!getNavigationState().active && (target === track || track!.contains(target))) {
        bypass = false
        enter(1, false)
        return
      }
      // Якорный переход не является жестом демонстрации: разрешаем пройти её границу.
      leaveForNavigation()
    }

    function onSectionNavigation(event: Event) {
      prepareNavigation((event as CustomEvent<SectionId>).detail)
    }

    function onHashChange() {
      const id = sectionFromHash()
      if (!id) return
      prepareNavigation(id)
      // Позицию якорного перехода и истории восстанавливает сам браузер.
    }

    function onScroll() {
      const position = window.scrollY
      if (getNavigationState().active) {
        previousY = position
        side = position > top ? 'after' : 'before'
        return
      }
      const fromWheel = isNativeWheelScroll(position)
      if (side === 'holding') {
        if (Math.abs(position - top) > 0.5) {
          if (fromWheel || keyboardScroll) align()
          else leaveForNavigation(position)
        }
        return
      }
      const crossedDown = side === 'before' && previousY <= top && position >= top
      const crossedUp = side === 'after' && previousY >= top && position <= top
      // Scroll не сообщает источник: ползунок, якорь и wheel создают одинаковое событие.
      // Захватываем пересечение всего пути, а не только кадр возле якоря.
      if (!bypass && (keyboardScroll || fromWheel) && gesture.mode !== 'released' && (crossedDown || crossedUp)) {
        enter(crossedDown ? 1 : -1, fromWheel)
        return
      }
      previousY = position
      side = position > top ? 'after' : 'before'
    }

    function clearScrollInput() {
      keyboardScroll = false
      nativeWheelScroll = undefined
    }

    function onScrollEnd() {
      // align() тоже вызывает scrollend. Он завершает наше выравнивание, а не
      // обязательно весь поток wheel: кадры браузера ещё могут находиться в очереди.
      // Пока сцена удерживается, ввод передают только явная навигация или release().
      if (side !== 'holding') clearScrollInput()
    }

    function onPointerDown(event: MouseEvent) {
      clearScrollInput()
      const root = document.documentElement
      const scrollbar = event.clientX >= root.clientWidth || event.clientX < root.clientLeft || event.clientY >= root.clientHeight
      if (scrollbar) leaveForNavigation()
    }

    function onPointerOut(event: MouseEvent) {
      // Нативная полоса может не отправить pointerdown в DOM. Выход курсора
      // из документа также передаёт владение прокруткой обратно браузеру.
      if (!event.relatedTarget) clearScrollInput()
    }

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return
      bypass = false
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1)
      const now = performance.now()
      keyboardScroll = false
      // Наблюдаем поток ещё до входа, чтобы его инерционный хвост принадлежал входу.
      const direction = gesture.feed(delta, now)
      if (side !== 'holding') {
        const position = window.scrollY
        const crossingDown = side === 'before' && previousY <= top && delta > 0 && position + delta >= top
        const crossingUp = side === 'after' && previousY >= top && delta < 0 && position + delta <= top
        if (gesture.mode !== 'released' && (crossingDown || crossingUp) && event.cancelable) {
          event.preventDefault()
          enter(crossingDown ? 1 : -1, true)
        } else {
          rememberNativeWheel(position, delta)
        }
        return
      }

      const outward = (current.current === 0 && delta < 0) || (current.current === 3 && delta > 0)
      if (gesture.mode === 'pending' && !animating.current && outward) {
        release(Math.sign(delta))
        rememberNativeWheel(window.scrollY, delta)
        return
      }
      if (event.cancelable) event.preventDefault()
      else rememberNativeWheel(window.scrollY, delta)
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
        leaveForNavigation()
        return
      }
      if (side !== 'holding') {
        if (direction) {
          bypass = false
          keyboardScroll = true
          nativeWheelScroll = undefined
          gesture.reset()
        }
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        leaveForNavigation()
        document.getElementById('how-it-works-end')?.focus({ preventScroll: true })
        window.scrollTo({ top: top + track!.offsetHeight, behavior: 'instant' })
        return
      }
      if (event.key === 'Tab') {
        const controls = scene!.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]')
        const leaving = event.shiftKey ? target === controls[0] : target === controls[controls.length - 1]
        if (leaving) {
          leaveForNavigation()
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
      leaveForNavigation()
    }

    skip.current = () => {
      leaveForNavigation()
    }
    const unsubscribeNavigation = subscribeNavigation(() => {
      if (getNavigationState().active) leaveForNavigation()
    })
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    observer.observe(document.body)
    // Восстановленный адрес/scroll position тоже проходит через тот же вход.
    const initialFrame = requestAnimationFrame(() => {
      if (!bypass && Math.abs(window.scrollY - top) <= 1) enter(1, false)
    })
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScrollEnd)
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('mousedown', onPointerDown, true)
    window.addEventListener('pointerout', onPointerOut)
    window.addEventListener('mouseout', onPointerOut)
    window.addEventListener('blur', clearScrollInput)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('focusin', onFocusIn)
    window.addEventListener(sectionNavigationEvent, onSectionNavigation)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      cancelAnimationFrame(initialFrame)
      unsubscribeNavigation()
      observer.disconnect()
      skip.current = () => {}
      setPinned(false)
      clearTimeout(timer.current)
      animating.current = false
      setBusy(false)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('mousedown', onPointerDown, true)
      window.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('mouseout', onPointerOut)
      window.removeEventListener('blur', clearScrollInput)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('focusin', onFocusIn)
      window.removeEventListener(sectionNavigationEvent, onSectionNavigation)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [enhanced, trackRef, sceneRef, selectStep])

  return { step, busy, pinned, selectStep, skipSequence }
}
