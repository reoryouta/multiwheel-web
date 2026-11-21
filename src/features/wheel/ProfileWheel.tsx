import { motion, useIsPresent, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { WheelProfile } from './wheelProfiles'
import { useWheelInteraction } from './useWheelInteraction'
import { WheelView } from './WheelView'

type ProfileWheelProps = {
  profile: WheelProfile
  hintId: string
  interactive?: boolean
}

export function ProfileWheel({ profile, hintId, interactive = true }: ProfileWheelProps) {
  const { t } = useTranslation()
  const isPresent = useIsPresent()
  const shouldReduceMotion = useReducedMotion()
  const { rootRef, activeId, ringProps, getSectorProps } = useWheelInteraction(profile.actions.map(({ id }) => id), interactive)
  const actions = profile.actions.map((action) => ({
    ...action,
    label: t(action.labelKey),
    accessibleLabel: t('hero.wheel.actionLabel', { action: t(action.labelKey) }),
  }))

  return (
    <motion.div
      ref={rootRef}
      data-profile-id={profile.id}
      aria-hidden={!isPresent || !interactive}
      inert={!isPresent || !interactive}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.14 }}
      className="absolute inset-0"
    >
      <WheelView
        actions={actions}
        activeId={activeId}
        ringProps={ringProps}
        getSectorProps={getSectorProps}
        title={t('hero.wheel.profileTitle', { profile: t(profile.nameKey) })}
        description={`${t('hero.wheel.description')} ${t(profile.descriptionKey)}`}
        hintId={hintId}
        brand={t('header.brand')}
      />
    </motion.div>
  )
}
