import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { flowSceneState, getSceneState, scrollSceneConfig as config } from './scrollSceneConfig'
import { useMediaQuery } from './useMediaQuery'
import { getNavigationState, subscribeDirectPosition, subscribeNavigation } from './directNavigation'
import { resumeProgress, type ProgressAnchor } from './presentationProgress'
import { useDirectNavigation } from './useDirectNavigation'

const smoothStep = (value: number) => value * value * (3 - 2 * value)

type SceneRefs = {
  trackRef: RefObject<HTMLDivElement | null>
  heroRef: RefObject<HTMLDivElement | null>
  wheelAnchorRef: RefObject<HTMLDivElement | null>
  wheelVisualRef: RefObject<HTMLDivElement | null>
}

export function useScrollExperience({ trackRef, heroRef, wheelAnchorRef, wheelVisualRef }: SceneRefs) {
  const isDesktop = useMediaQuery(config.desktopQuery)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const enhanced = isDesktop && !prefersReducedMotion
  const navigation = useDirectNavigation()
  const progress = useMotionValue(0)
  const resumeAnchor = useRef<ProgressAnchor | undefined>(undefined)
  const [rebased, setRebased] = useState(false)
  const travelX = useMotionValue(0)
  const centerYCorrection = useMotionValue(0)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const movement = useTransform(progress, [...config.wheelMove], [0, 1], { ease: smoothStep })
  const wheelX = useTransform(() => travelX.get() * movement.get())
  const wheelY = useTransform(() => centerYCorrection.get() * movement.get())
  const wheelScale = useTransform(movement, [0, 1], [1, config.wheelEndScale])
  // Текстовый слой компенсирует этот масштаб через CSS, без React-рендеров на кадрах прокрутки.
  const inverseWheelScale = useTransform(wheelScale, (scale) => 1 / scale)
  const heroOpacity = useTransform(progress, [...config.heroFade], [1, 0])
  const heroY = useTransform(progress, [...config.heroFade], [0, -32])
  const philosophyOpacity = useTransform(progress, [...config.philosophyFade], [0, 1])
  const philosophyY = useTransform(progress, [...config.philosophyFade], [24, 0])
  const controlsOpacity = useTransform(progress, [...config.controlsFade], [1, 0])
  const indicatorOpacity = useTransform(progress, [0.03, 0.14], [1, 0])

  const [sceneState, setSceneState] = useState(() => getSceneState(0))
  const lastState = useRef(sceneState)
  const updateAccessibility = useCallback((progress: number) => {
    const next = getSceneState(progress)
    const previous = lastState.current
    if (next.heroHidden === previous.heroHidden &&
        next.philosophyHidden === previous.philosophyHidden &&
        next.controlsHidden === previous.controlsHidden &&
        next.interactive === previous.interactive && next.phase === previous.phase) return

    // React обновляется только на границах доступности сцен, не на кадрах анимации.
    lastState.current = next
    setSceneState(next)
  }, [])

  const syncProgress = useCallback((raw: number) => {
    const direct = getNavigationState()
    const visual = direct.active
      ? (direct.target === 'top' || direct.target === 'about' || raw < 0.5 ? 0 : 1)
      : resumeProgress(raw, resumeAnchor.current)
    if (direct.active && trackRef.current) {
      const scene = visual === 0 ? 'hero' : 'philosophy'
      if (trackRef.current.dataset.directScene !== scene) trackRef.current.dataset.directScene = scene
    }
    if (progress.get() === visual) return
    progress.set(visual)
    updateAccessibility(visual)
  }, [progress, trackRef, updateAccessibility])

  useMotionValueEvent(scrollYProgress, 'change', (raw) => {
    if (enhanced && !getNavigationState().active) syncProgress(raw)
  })

  useLayoutEffect(() => {
    if (!enhanced) return
    const hero = heroRef.current
    const anchor = wheelAnchorRef.current
    const visual = wheelVisualRef.current
    if (!hero || !anchor || !visual) return

    function measure() {
      if (!hero || !anchor || !visual) return
      // Измеряем неподвижные колонки. Transform колеса не влияет на эти координаты.
      const left = hero.getBoundingClientRect()
      const right = anchor.getBoundingClientRect()
      travelX.set(left.left + left.width / 2 - right.left - right.width / 2)
      // Центр SVG, а не невидимая подпись, выравнивается с текстом Philosophy.
      centerYCorrection.set((anchor.offsetHeight - visual.offsetHeight) / 2 * config.wheelEndScale)
      trackRef.current?.style.setProperty('--direct-wheel-x', `${travelX.get()}px`)
      trackRef.current?.style.setProperty('--direct-wheel-y', `${centerYCorrection.get()}px`)
      trackRef.current?.style.setProperty('--direct-wheel-scale', String(config.wheelEndScale))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(hero)
    observer.observe(anchor)
    observer.observe(visual)
    return () => observer.disconnect()
  }, [enhanced, heroRef, wheelAnchorRef, wheelVisualRef, trackRef, travelX, centerYCorrection])

  useLayoutEffect(() => {
    if (!enhanced) return
    const track = trackRef.current
    if (!track) return
    let trackTop = 0
    let trackHeight = 0
    let viewportHeight = 0
    const rawPosition = () => Math.max(0, Math.min(1, (window.scrollY - trackTop) / Math.max(1, trackHeight - viewportHeight)))
    const measure = () => {
      const top = track.getBoundingClientRect().top + window.scrollY
      const height = track.offsetHeight
      const viewport = window.innerHeight
      if (top === trackTop && height === trackHeight && viewport === viewportHeight) return
      trackTop = top
      trackHeight = height
      viewportHeight = viewport
      // Обновляем шкалу при изменении геометрии сцены или окна.
      syncProgress(rawPosition())
    }
    const clearAnchor = () => {
      resumeAnchor.current = undefined
      setRebased(false)
    }
    const synchronize = () => {
      const raw = rawPosition()
      if (getNavigationState().active) {
        clearAnchor()
        syncProgress(raw)
      } else {
        const visual = progress.get()
        // Keep the inner handoff suppressed while a directly visited composition
        // is still visible, even at raw=1 where the old handoff may already be hidden.
        const needsAnchor = (raw > 0 || Math.abs(visual - raw) > 0.001) && window.scrollY < trackTop + trackHeight
        resumeAnchor.current = needsAnchor ? { raw, visual } : undefined
        setRebased(needsAnchor)
        syncProgress(raw)
      }
    }
    const onScroll = () => {
      if (!resumeAnchor.current || getNavigationState().active) return
      const raw = rawPosition()
      if ((raw === 0 && progress.get() === 0) || window.scrollY >= trackTop + trackHeight) {
        clearAnchor()
        syncProgress(raw)
      }
    }
    measure()
    const unsubscribe = subscribeNavigation(synchronize)
    const unsubscribePosition = subscribeDirectPosition(() => syncProgress(rawPosition()))
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      unsubscribe()
      unsubscribePosition()
      observer.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', onScroll)
    }
  }, [enhanced, trackRef, progress, syncProgress])

  return {
    enhanced,
    direct: navigation.active,
    handoffEnabled: enhanced && !navigation.active && !rebased,
    state: enhanced ? sceneState : flowSceneState,
    heroStyle: enhanced ? { opacity: heroOpacity, y: heroY } : { opacity: 1, y: 0 },
    wheelStyle: enhanced
      ? { x: wheelX, y: wheelY, scale: wheelScale, '--wheel-inverse-scale': inverseWheelScale }
      : { x: 0, y: 0, scale: 1, '--wheel-inverse-scale': 1 },
    philosophyStyle: enhanced ? { opacity: philosophyOpacity, y: philosophyY } : { opacity: 1, y: 0 },
    controlsStyle: enhanced ? { opacity: controlsOpacity } : { opacity: 1 },
    indicatorStyle: enhanced ? { opacity: indicatorOpacity } : { opacity: 1 },
  }
}
