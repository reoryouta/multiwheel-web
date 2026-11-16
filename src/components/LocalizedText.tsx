import type { ParseKeys, TFunction } from 'i18next'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { languages } from '../i18n'
import { useLanguageTransition } from '../i18n/useLanguageTransition'

type LocalizedRegionProps = {
  children: (translate: TFunction, measuring: boolean) => ReactNode
  inline?: boolean
}

// Невидимые текстовые копии резервируют максимум размеров RU/EN. Колесо и сцены не копируются.
export function LocalizedRegion({ children, inline = false }: LocalizedRegionProps) {
  const { i18n } = useTranslation()
  const { textOpacity } = useLanguageTransition()
  const Root = inline ? 'span' : 'div'
  const Current = inline ? motion.span : motion.div

  return (
    <Root className={`localized-region${inline ? ' localized-region--inline' : ''}`}>
      <Current className="localized-current" data-localized-current="" lang={i18n.resolvedLanguage} style={{ opacity: textOpacity }}>
        {children(i18n.getFixedT(i18n.resolvedLanguage ?? 'ru'), false)}
      </Current>
      {languages.map(({ code }) => (
        <Root key={code} className="localized-measure" data-localized-measure={code} aria-hidden="true" lang={code}>
          {children(i18n.getFixedT(code), true)}
        </Root>
      ))}
    </Root>
  )
}

export function LocalizedText({ textKey }: { textKey: ParseKeys }) {
  return <LocalizedRegion inline>{(translate) => translate(textKey)}</LocalizedRegion>
}
