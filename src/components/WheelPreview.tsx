import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { wheelActions } from '../features/wheel/wheelActions'
import { useWheelInteraction } from '../features/wheel/useWheelInteraction'
import { WheelView } from '../features/wheel/WheelView'

export function WheelPreview() {
  const { t } = useTranslation()
  const hintId = useId()
  const { rootRef, activeId, getSectorProps } = useWheelInteraction(wheelActions.map(({ id }) => id))
  const actions = wheelActions.map((action) => ({
    ...action,
    label: t(action.labelKey),
    accessibleLabel: t('hero.wheel.actionLabel', { action: t(action.labelKey) }),
  }))

  return (
    <figure ref={rootRef} className="mx-auto w-full max-w-[32rem]">
      <div className="relative isolate aspect-square">
        <div aria-hidden="true" className="wheel-preview-glow pointer-events-none absolute inset-0 -z-10" />
        <WheelView
          actions={actions}
          activeId={activeId}
          getSectorProps={getSectorProps}
          title={t('hero.wheel.title')}
          description={t('hero.wheel.description')}
          hintId={hintId}
          brand={t('header.brand')}
          demoLabel={t('hero.wheel.demoLabel')}
        />
      </div>
      <figcaption className="mt-1 space-y-2 text-center text-xs text-secondary">
        <p>{t('hero.wheel.caption')}</p>
        <p>{t('hero.wheel.hint')}</p>
        <p id={hintId} className="sr-only">{t('hero.wheel.keyboardHint')}</p>
      </figcaption>
    </figure>
  )
}
