import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { WheelView } from '../wheel/WheelView'
import { wheelActions } from '../wheel/wheelActions'

// Только фирменный образ: нет обработчиков действий и элементов в порядке Tab.
export function DecorativeWheel() {
  const { t } = useTranslation()
  const hintId = useId()
  const actions = wheelActions.map((action) => ({ ...action, label: t(action.labelKey), accessibleLabel: '' }))

  return (
    <div aria-hidden="true" inert className="final-wheel-visual">
      <div className="wheel-preview-glow final-wheel-glow" />
      <WheelView
        mode="demo"
        actions={actions}
        activeId={null}
        getSectorProps={() => ({})}
        title={t('app.name')}
        description=""
        hintId={hintId}
        brand={t('header.brand')}
      />
      <span id={hintId} className="sr-only">{t('app.name')}</span>
    </div>
  )
}
