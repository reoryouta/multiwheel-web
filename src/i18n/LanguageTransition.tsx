import { animate, useMotionValue } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import i18n, { rememberLanguage, type Language } from './index'
import { microMotion, useMotionPreference } from '../lib/microMotion'
import { LanguageTransitionContext } from './useLanguageTransition'
const currentLanguage = (): Language => i18n.resolvedLanguage === 'en' ? 'en' : 'ru'

export function LanguageTransitionProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useMotionPreference()
  const textOpacity = useMotionValue(1)
  const [requestedLanguage, setRequestedLanguage] = useState(currentLanguage)
  const requested = useRef(requestedLanguage)
  const version = useRef(0)
  const animation = useRef<{ stop: () => void } | null>(null)

  const requestLanguage = useCallback((language: Language) => {
    if (language === requested.current) return
    requested.current = language
    setRequestedLanguage(language)
    rememberLanguage(language)
    const requestVersion = ++version.current
    animation.current?.stop()

    if (reduceMotion) {
      textOpacity.set(1)
      void i18n.changeLanguage(language)
      return
    }

    // Отмена выбора во время затухания возвращает текущий текст без лишней смены языка.
    if (language === currentLanguage()) {
      animation.current = animate(textOpacity, 1, { duration: microMotion.textIn, ease: microMotion.ease })
      return
    }

    void (async () => {
      const fadeOut = animate(textOpacity, 0, { duration: microMotion.textOut, ease: microMotion.ease })
      animation.current = fadeOut
      await fadeOut
      if (requestVersion !== version.current) return

      try {
        await i18n.changeLanguage(language)
      } catch (error) {
        if (requestVersion !== version.current) return
        requested.current = currentLanguage()
        setRequestedLanguage(requested.current)
        rememberLanguage(requested.current)
        console.error('Unable to change the site language.', error)
      }

      if (requestVersion !== version.current) return
      animation.current = animate(textOpacity, 1, { duration: microMotion.textIn, ease: microMotion.ease })
    })()
  }, [reduceMotion, textOpacity])

  useEffect(() => {
    if (!reduceMotion) return
    ++version.current
    animation.current?.stop()
    textOpacity.set(1)
    void i18n.changeLanguage(requested.current)
  }, [reduceMotion, textOpacity])

  useEffect(() => () => {
    ++version.current
    animation.current?.stop()
  }, [])

  const value = useMemo(() => ({ requestedLanguage, requestLanguage, textOpacity }), [requestedLanguage, requestLanguage, textOpacity])

  return <LanguageTransitionContext.Provider value={value}>{children}</LanguageTransitionContext.Provider>
}

