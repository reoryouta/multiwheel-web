import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { languages } from '../i18n'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('languageSwitcher.label')}
      className="flex min-h-10 items-center gap-2"
    >
      <Languages size={18} aria-hidden="true" className="text-secondary" />
      <div className="flex rounded-control border border-border bg-surface p-1">
        {languages.map(({ code, label, name }) => (
          <button
            key={code}
            type="button"
            lang={code}
            aria-label={name}
            aria-pressed={i18n.resolvedLanguage === code}
            onClick={() => void i18n.changeLanguage(code)}
            className="min-h-8 cursor-pointer rounded-md px-2.5 text-xs font-medium text-secondary hover:text-primary aria-pressed:bg-accent/20 aria-pressed:text-primary"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
