import { motion, useMotionValue, useTransform } from 'motion/react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { microMotion } from '../../lib/microMotion'
import { WheelView } from '../wheel/WheelView'
import type { WheelProfile } from '../wheel/wheelProfiles'
import { howItWorksConfig } from './howItWorksConfig'

export function HowItWorksWheel({ profile, step, reduceMotion }: { profile: WheelProfile; step: number; reduceMotion: boolean }) {
  const { t } = useTranslation()
  const hintId = useId()
  const scale = useMotionValue(1)
  const inverseScale = useTransform(scale, (value) => 1 / value)
  const wheelStyle = { scale, '--wheel-inverse-scale': inverseScale }
  const visible = step === 1 || step === 2
  const actions = profile.actions.map((action) => ({ ...action, label: t(action.labelKey), accessibleLabel: t('hero.wheel.actionLabel', { action: t(action.labelKey) }) }))

  return (
    <motion.div
      initial={false}
      aria-hidden={!visible}
      data-how-wheel=""
      animate={{ opacity: visible ? 1 : 0, scale: reduceMotion ? 1 : visible ? 1 : howItWorksConfig.hiddenScale }}
      transition={{ duration: reduceMotion ? 0.14 : visible ? howItWorksConfig.duration : howItWorksConfig.closeDuration, ease: microMotion.ease }}
      style={wheelStyle}
      className="how-wheel relative isolate aspect-square pointer-events-none"
    >
      <div aria-hidden="true" className="wheel-preview-glow absolute inset-0 -z-10" />
      <WheelView
        mode="demo"
        actions={actions}
        activeId={step === 2 ? profile.actions[1]?.id ?? profile.actions[0]?.id ?? null : null}
        getSectorProps={() => ({})}
        title={t('hero.wheel.profileTitle', { profile: t(profile.nameKey) })}
        description={t('hero.wheel.description')}
        hintId={hintId}
        brand={t('header.brand')}
      />
      <span id={hintId} className="sr-only">{t('hero.wheel.description')}</span>
    </motion.div>
  )
}
