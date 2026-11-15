import { ArrowDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ScrollIndicator() {
  const { t } = useTranslation()

  return (
    <p className="flex items-center justify-center gap-2 text-xs text-secondary">
      {t('scroll.continue')}
      <ArrowDown size={14} strokeWidth={1.5} aria-hidden="true" />
    </p>
  )
}
