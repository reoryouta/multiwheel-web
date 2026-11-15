import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { languages } from '../i18n'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('languageSwitcher.label')}
      className="flex items-center gap-2"
    >
      <Languages size={20} aria-hidden="true" className="mr-1 text-slate-600" />
      {languages.map(({ code, label, name }) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-label={name}
          aria-pressed={i18n.resolvedLanguage === code}
          onClick={() => void i18n.changeLanguage(code)}
          className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 aria-pressed:border-slate-900 aria-pressed:bg-slate-900 aria-pressed:text-white"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
