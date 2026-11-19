import { useId, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { LocalizedRegion, LocalizedText } from '../../components/LocalizedText'
import { SegmentedControl } from '../../components/SegmentedControl'
import { useMotionPreference } from '../../lib/microMotion'
import { ProfileWheel } from '../wheel/ProfileWheel'
import { contextApps, type ContextAppId } from './contextApps'
import { WorkspaceEnvironment } from './WorkspaceEnvironment'
import { ContextCrossfade } from './ContextCrossfade'
import { contextMotion } from './contextMotion'
import { useDirectNavigation } from '../scroll/useDirectNavigation'
import './context-experience.css'

const hiddenEntrance = { heading: false, frame: false, wheel: false, wheelReady: false }
const visibleEntrance = { heading: true, frame: true, wheel: true, wheelReady: true }

export function ContextExperience() {
  const { t } = useTranslation()
  const windowId = useId()
  const hintId = useId()
  const reduceMotion = useMotionPreference()
  const sectionRef = useRef<HTMLElement>(null)
  const { active: direct } = useDirectNavigation()
  const wasDirect = useRef(direct)
  const [revealed, setEntrance] = useState(hiddenEntrance)
  const entrance = direct ? visibleEntrance : revealed
  const wheelReady = entrance.wheelReady
  const [appId, setAppId] = useState<ContextAppId>(contextApps[0].id)
  const app = contextApps.find(({ id }) => id === appId) ?? contextApps[0]
  const AppIcon = app.icon

  useLayoutEffect(() => {
    if (wasDirect.current && !direct) {
      const rect = sectionRef.current?.getBoundingClientRect()
      // A direct pass is already visible. Do not queue a second entrance on release.
      setEntrance(rect && rect.bottom > 0 && rect.top < window.innerHeight ? visibleEntrance : hiddenEntrance)
    }
    wasDirect.current = direct
  }, [direct])

  function reveal(part: 'heading' | 'frame' | 'wheel') {
    // Выход отдельного элемента за край экрана не сбрасывает уже показанную сцену.
    setEntrance((current) => current[part] ? current : { ...current, [part]: true })
  }

  return (
    <motion.section
      ref={sectionRef}
      id="context"
      tabIndex={-1}
      aria-labelledby="context-title"
      className="context-experience site-container outline-none"
      viewport={{ amount: 0 }}
      onViewportLeave={() => setEntrance(hiddenEntrance)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={direct ? 'direct' : entrance.heading ? 'visible' : 'hidden'}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 }, direct: { opacity: 1, transition: { type: false } } }}
        onViewportEnter={() => reveal('heading')}
        viewport={contextMotion.viewport}
        transition={{ duration: entrance.heading ? (reduceMotion ? contextMotion.reducedEntranceDuration : contextMotion.entranceDuration) : 0, ease: contextMotion.entranceEase }}
      >
        <LocalizedRegion>
          {(translate, measuring) => (
            <div className="context-heading">
              <h2 id={measuring ? undefined : 'context-title'} className="scene-title">
                <span className="block">{translate('context.titleLineOne')}</span>{' '}
                <span className="block text-primary/65">{translate('context.titleLineTwo')}</span>
              </h2>
            </div>
          )}
        </LocalizedRegion>
      </motion.div>

      <motion.div
        id={windowId}
        role="group"
        aria-label={t('context.workspaceLabel', { app: t(app.nameKey) })}
        className="context-window"
        data-context-app={app.id}
        initial={{ opacity: 0, y: reduceMotion ? 0 : contextMotion.offset }}
        animate={direct ? 'direct' : entrance.frame ? 'visible' : 'hidden'}
        variants={{
          hidden: { opacity: 0, y: reduceMotion ? 0 : contextMotion.offset },
          visible: { opacity: 1, y: 0 },
          direct: { opacity: 1, y: 0, transition: { type: false } },
        }}
        onViewportEnter={() => reveal('frame')}
        viewport={contextMotion.viewport}
        transition={{ duration: entrance.frame ? (reduceMotion ? contextMotion.reducedEntranceDuration : contextMotion.entranceDuration) : 0, delay: entrance.frame && !reduceMotion ? contextMotion.stagger : 0, ease: contextMotion.entranceEase }}
      >
        <div className="context-window-bar">
          <div className="context-window-name"><AppIcon size={15} strokeWidth={1.5} aria-hidden="true" /><span>{t(app.nameKey)}</span></div>
          <span className="context-window-caption"><LocalizedText textKey="context.concept" /></span>
          <svg aria-hidden="true" width="64" height="12" viewBox="0 0 64 12" fill="none" className="context-window-controls">
            <path d="M1 6h8M27 2h8v8h-8zM53 2l8 8m0-8-8 8" stroke="currentColor" />
          </svg>
        </div>
        <div className="context-workspace">
          {contextApps.map((profile) => (
            <ContextCrossfade key={profile.id} active={profile.id === app.id}>
              <WorkspaceEnvironment appId={profile.id} />
            </ContextCrossfade>
          ))}
          {/* Постоянный контейнер отвечает за положение; меняются только действия внутри. */}
          <div className="context-wheel">
            <div aria-hidden="true" className="wheel-preview-glow pointer-events-none absolute inset-0 -z-10" />
            <motion.div
              initial="hidden"
              animate={direct ? 'direct' : entrance.wheel ? 'visible' : 'hidden'}
              variants={{
                direct: { opacity: 1, scale: 1, transition: { type: false } },
                hidden: { opacity: 0, scale: reduceMotion ? 1 : contextMotion.wheelScale, transition: { duration: 0 } },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: reduceMotion ? contextMotion.reducedEntranceDuration : contextMotion.entranceDuration, delay: reduceMotion ? 0 : contextMotion.stagger * 2, ease: contextMotion.entranceEase },
                },
              }}
              onViewportEnter={() => reveal('wheel')}
              viewport={contextMotion.viewport}
              onAnimationComplete={(definition) => {
                if (definition !== 'visible') return
                setEntrance((current) => current.wheel && !current.wheelReady ? { ...current, wheelReady: true } : current)
              }}
              inert={!wheelReady}
              className="absolute inset-0"
            >
              {/* Слои остаются смонтированы: opacity перенаправляется к последнему выбору. */}
              {contextApps.map((profile) => (
                <ContextCrossfade key={profile.id} active={profile.id === app.id}>
                  <ProfileWheel profile={profile} hintId={hintId} interactive={wheelReady && profile.id === app.id} />
                </ContextCrossfade>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="context-controls">
        <SegmentedControl
          items={contextApps.map((profile) => ({ id: profile.id, label: t(profile.nameKey), icon: profile.icon }))}
          selectedId={app.id}
          onSelect={(id) => {
            const selectedApp = contextApps.find((profile) => profile.id === id)
            if (selectedApp) setAppId(selectedApp.id)
          }}
          label={t('context.switcherLabel')}
          controlsId={windowId}
          highlightMode="horizontal"
          className="context-switcher mx-auto grid w-fit max-w-full grid-cols-3 gap-1 rounded-control border border-border bg-surface/60 p-1"
          buttonClassName="min-h-11 gap-1.5 px-2 whitespace-nowrap sm:px-4"
        />
      </div>
      <p id={hintId} className="sr-only">{t('hero.wheel.keyboardHint')}</p>
    </motion.section>
  )
}
