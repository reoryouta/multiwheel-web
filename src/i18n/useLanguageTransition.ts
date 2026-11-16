import { createContext, useContext } from 'react'
import type { MotionValue } from 'motion/react'
import type { Language } from './index'

type LanguageTransitionValue = {
  requestedLanguage: Language
  requestLanguage: (language: Language) => void
  textOpacity: MotionValue<number>
}

export const LanguageTransitionContext = createContext<LanguageTransitionValue | null>(null)

export function useLanguageTransition() {
  const value = useContext(LanguageTransitionContext)
  if (!value) throw new Error('LanguageTransitionProvider is missing.')
  return value
}
