import { AnimatePresence } from 'motion/react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ProfileSwitcher } from '../features/wheel/ProfileSwitcher'
import { ProfileWheel } from '../features/wheel/ProfileWheel'
import { wheelProfiles } from '../features/wheel/wheelProfiles'

export function WheelPreview() {
  const { t } = useTranslation()
  const hintId = useId()
  const wheelId = useId()
  const [profileId, setProfileId] = useState<string>(wheelProfiles[0].id)
  const profile = wheelProfiles.find(({ id }) => id === profileId) ?? wheelProfiles[0]

  return (
    <figure className="mx-auto w-full max-w-[32rem]">
      <div id={wheelId} className="relative isolate aspect-square">
        <div aria-hidden="true" className="wheel-preview-glow pointer-events-none absolute inset-0 -z-10" />
        <AnimatePresence initial={false} mode="wait">
          {/* Новый key создаёт чистое состояние выбора и фокуса для каждого профиля. */}
          <ProfileWheel key={profile.id} profile={profile} hintId={hintId} />
        </AnimatePresence>
      </div>
      <figcaption className="mt-1 text-center text-xs text-secondary">
        <ProfileSwitcher
          profiles={wheelProfiles.map((item) => ({ id: item.id, name: t(item.nameKey), icon: item.icon }))}
          selectedId={profile.id}
          onSelect={setProfileId}
          label={t('hero.wheel.profiles.label')}
          controlsId={wheelId}
        />
        <p aria-live="polite" className="mt-2 flex min-h-8 items-center justify-center text-balance">
          {t(profile.descriptionKey)}
        </p>
        <p className="mt-1">{t('hero.wheel.hint')}</p>
        <p id={hintId} className="sr-only">{t('hero.wheel.keyboardHint')}</p>
      </figcaption>
    </figure>
  )
}
