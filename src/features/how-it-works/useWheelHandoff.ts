import { useRef, useState, type RefObject } from 'react'
import { useMotionValueEvent, useScroll, useTransform } from 'motion/react'

export function useWheelHandoff(target: RefObject<HTMLElement | null>, enabled: boolean) {
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'start 75%'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const [leaving, setLeaving] = useState(false)
  const previous = useRef(false)
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = value > 0
    if (next === previous.current) return
    previous.current = next
    setLeaving(next)
  })
  return {
    leaving: enabled && leaving,
    style: enabled ? { opacity, scale } : { opacity: 1, scale: 1 },
  }
}
