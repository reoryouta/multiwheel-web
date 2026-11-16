import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { flowSceneState, getSceneState, scrollSceneConfig as config } from './scrollSceneConfig'
import { useMediaQuery } from './useMediaQuery'

const smoothStep = (value: number) => value * value * (3 - 2 * value)

export function useScrollExperience() {
  const trackRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const wheelAnchorRef = useRef<HTMLDivElement>(null)
  const wheelVisualRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery(config.desktopQuery)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const enhanced = isDesktop && !prefersReducedMotion
  const travelX = useMotionValue(0)
  const centerYCorrection = useMotionValue(0)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
    trackContentSize: true,
  })

  const movement = useTransform(scrollYProgress, [...config.wheelMove], [0, 1], { ease: smoothStep })
  const wheelX = useTransform(() => travelX.get() * movement.get())
  const wheelY = useTransform(() => centerYCorrection.get() * movement.get())
  const wheelScale = useTransform(movement, [0, 1], [1, config.wheelEndScale])
  // Текстовый слой компенсирует этот масштаб через CSS, без React-рендеров на кадрах прокрутки.
  const inverseWheelScale = useTransform(wheelScale, (scale) => 1 / scale)
  const heroOpacity = useTransform(scrollYProgress, [...config.heroFade], [1, 0])
  const heroY = useTransform(scrollYProgress, [...config.heroFade], [0, -32])
  const philosophyOpacity = useTransform(scrollYProgress, [...config.philosophyFade], [0, 1])
  const philosophyY = useTransform(scrollYProgress, [...config.philosophyFade], [24, 0])
  const controlsOpacity = useTransform(scrollYProgress, [...config.controlsFade], [1, 0])
  const indicatorOpacity = useTransform(scrollYProgress, [0.03, 0.14], [1, 0])

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

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (enhanced) updateAccessibility(progress)
  })

  useEffect(() => {
    if (enhanced) updateAccessibility(scrollYProgress.get())
  }, [enhanced, scrollYProgress, updateAccessibility])

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
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(hero)
    observer.observe(anchor)
    observer.observe(visual)
    return () => observer.disconnect()
  }, [enhanced, travelX, centerYCorrection])

  return {
    trackRef, heroRef, wheelAnchorRef, wheelVisualRef, enhanced,
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
