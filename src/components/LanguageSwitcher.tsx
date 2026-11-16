import { Languages } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { languages } from '../i18n'
import { useLanguageTransition } from '../i18n/useLanguageTransition'
import { microMotion, useMotionPreference } from '../lib/microMotion'
import { SegmentedControl } from './SegmentedControl'

export function LanguageSwitcher() {
  const { t } = useTranslation()
  const { requestedLanguage, requestLanguage } = useLanguageTransition()
  const reduceMotion = useMotionPreference()

  return (
    <motion.div
      initial={false}
      animate={{ color: 'var(--text-secondary)' }}
      whileHover={{ color: 'var(--accent)' }}
      transition={{ duration: reduceMotion ? 0 : microMotion.hover, ease: microMotion.ease }}
      className="flex min-h-10 items-center gap-2"
    >
      <Languages size={18} aria-hidden="true" />
      <SegmentedControl
        items={languages.map(({ code, label, name }) => ({ id: code, label, accessibleLabel: name, lang: code }))}
        selectedId={requestedLanguage}
        onSelect={(code) => requestLanguage(code === 'en' ? 'en' : 'ru')}
        label={t('languageSwitcher.label')}
        className="flex rounded-control border border-border bg-surface p-1"
        buttonClassName="min-h-8 px-2.5"
      />
    </motion.div>
  )
}
