import { AnimatePresence, motion, type MotionStyle } from 'motion/react'
import { useEffect, useId, useRef, useState, type Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { ProfileSwitcher } from '../features/wheel/ProfileSwitcher'
import { ProfileWheel } from '../features/wheel/ProfileWheel'
import { wheelProfiles } from '../features/wheel/wheelProfiles'
import { LocalizedText } from './LocalizedText'

type WheelPreviewProps = {
  interactive?: boolean
  controlsVisible?: boolean
  controlsStyle?: MotionStyle
  visualRef?: Ref<HTMLDivElement>
}

export function WheelPreview({ interactive = true, controlsVisible = true, controlsStyle, visualRef }: WheelPreviewProps) {
  const { t } = useTranslation()
  const hintId = useId()
  const wheelId = useId()
  const controlsRef = useRef<HTMLElement>(null)
  const [profileId, setProfileId] = useState<string>(wheelProfiles[0].id)
  const profile = wheelProfiles.find(({ id }) => id === profileId) ?? wheelProfiles[0]

  useEffect(() => {
    if ((!controlsVisible || !interactive) && controlsRef.current?.contains(document.activeElement)) {
      (document.activeElement as HTMLElement)?.blur()
    }
  }, [controlsVisible, interactive])

  return (
    <figure className="mx-auto w-full max-w-[32rem]">
      <div ref={visualRef} id={wheelId} className="relative isolate aspect-square">
        <div aria-hidden="true" className="wheel-preview-glow pointer-events-none absolute inset-0 -z-10" />
        <AnimatePresence initial={false} mode="wait">
          {/* Новый key создаёт чистое состояние выбора и фокуса для каждого профиля. */}
          <ProfileWheel key={profile.id} profile={profile} hintId={hintId} interactive={interactive} />
        </AnimatePresence>
      </div>
      <motion.figcaption
        ref={controlsRef}
        style={controlsStyle}
        aria-hidden={!controlsVisible}
        inert={!controlsVisible || !interactive}
        className="mt-1 text-center text-xs text-secondary"
      >
        <ProfileSwitcher
          profiles={wheelProfiles.map((item) => ({ id: item.id, name: t(item.nameKey), icon: item.icon }))}
          selectedId={profile.id}
          onSelect={setProfileId}
          label={t('hero.wheel.profiles.label')}
          controlsId={wheelId}
        />
        <p aria-live="polite" className="mt-2 flex min-h-8 items-center justify-center text-balance">
          <LocalizedText textKey={profile.descriptionKey} />
        </p>
        <p className="mt-1"><LocalizedText textKey="hero.wheel.hint" /></p>
      </motion.figcaption>
      <p id={hintId} className="sr-only">{t('hero.wheel.keyboardHint')}</p>
    </figure>
  )
}
