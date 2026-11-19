import { AnimatePresence, motion, type MotionStyle } from 'motion/react'
import { useEffect, useId, useRef, useState, type Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { ProfileSwitcher } from '../features/wheel/ProfileSwitcher'
import { ProfileWheel } from '../features/wheel/ProfileWheel'
import { wheelProfiles } from '../features/wheel/wheelProfiles'
import type { WheelProfile } from '../features/wheel/wheelProfiles'

type WheelPreviewProps = {
  interactive?: boolean
  controlsVisible?: boolean
  controlsStyle?: MotionStyle
  visualRef?: Ref<HTMLDivElement>
  visualStyle?: MotionStyle
  onProfileChange?: (profile: WheelProfile) => void
}

export function WheelPreview({ interactive = true, controlsVisible = true, controlsStyle, visualRef, visualStyle, onProfileChange }: WheelPreviewProps) {
  const { t } = useTranslation()
  const hintId = useId()
  const wheelId = useId()
  const controlsRef = useRef<HTMLElement>(null)
  const [profileId, setProfileId] = useState<string>(wheelProfiles[0].id)
  const profile = wheelProfiles.find(({ id }) => id === profileId) ?? wheelProfiles[0]

  useEffect(() => { onProfileChange?.(profile) }, [onProfileChange, profile])

  useEffect(() => {
    if ((!controlsVisible || !interactive) && controlsRef.current?.contains(document.activeElement)) {
      (document.activeElement as HTMLElement)?.blur()
    }
  }, [controlsVisible, interactive])

  return (
    <figure className="mx-auto w-full max-w-[32rem]">
      <motion.div ref={visualRef} id={wheelId} initial={false} style={visualStyle} className="wheel-preview-visual relative isolate aspect-square">
        <div aria-hidden="true" className="wheel-preview-glow pointer-events-none absolute inset-0 -z-10" />
        <AnimatePresence initial={false} mode="wait">
          {/* Новый key создаёт чистое состояние выбора и фокуса для каждого профиля. */}
          <ProfileWheel key={profile.id} profile={profile} hintId={hintId} interactive={interactive} />
        </AnimatePresence>
      </motion.div>
      <motion.figcaption
        ref={controlsRef}
        style={controlsStyle}
        aria-hidden={!controlsVisible}
        inert={!controlsVisible || !interactive}
        className="mt-3 text-center text-xs text-secondary"
      >
        <ProfileSwitcher
          profiles={wheelProfiles.map((item) => ({ id: item.id, name: t(item.nameKey), icon: item.icon }))}
          selectedId={profile.id}
          onSelect={setProfileId}
          label={t('hero.wheel.profiles.label')}
          controlsId={wheelId}
        />
      </motion.figcaption>
      <p id={hintId} className="sr-only">{t('hero.wheel.keyboardHint')}</p>
    </figure>
  )
}
