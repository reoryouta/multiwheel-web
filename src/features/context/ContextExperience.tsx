import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LocalizedRegion, LocalizedText } from '../../components/LocalizedText'
import { SegmentedControl } from '../../components/SegmentedControl'
import { ProfileWheel } from '../wheel/ProfileWheel'
import { contextApps, type ContextAppId } from './contextApps'
import { WorkspaceEnvironment } from './WorkspaceEnvironment'
import './context-experience.css'

export function ContextExperience() {
  const { t } = useTranslation()
  const windowId = useId()
  const hintId = useId()
  const [appId, setAppId] = useState<ContextAppId>(contextApps[0].id)
  const app = contextApps.find(({ id }) => id === appId) ?? contextApps[0]
  const AppIcon = app.icon

  return (
    <section aria-labelledby="context-title" className="context-experience site-container">
      <LocalizedRegion>
        {(translate, measuring) => (
          <div className="context-heading">
            <h2 id={measuring ? undefined : 'context-title'} className="text-[clamp(2.5rem,5.2vw,4rem)] leading-[1.08] font-semibold tracking-[-0.055em] text-balance">
              <span className="block">{translate('context.titleLineOne')}</span>{' '}
              <span className="block text-primary/65">{translate('context.titleLineTwo')}</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-secondary sm:text-lg">
              {translate('context.description')}
            </p>
          </div>
        )}
      </LocalizedRegion>

      <div id={windowId} role="group" aria-label={t('context.workspaceLabel', { app: t(app.nameKey) })} className="context-window" data-context-app={app.id}>
        <div className="context-window-bar">
          <div className="context-window-name"><AppIcon size={15} strokeWidth={1.5} aria-hidden="true" /><span>{t(app.nameKey)}</span></div>
          <span className="context-window-caption"><LocalizedText textKey="context.concept" /></span>
          <svg aria-hidden="true" width="64" height="12" viewBox="0 0 64 12" fill="none" className="context-window-controls">
            <path d="M1 6h8M27 2h8v8h-8zM53 2l8 8m0-8-8 8" stroke="currentColor" />
          </svg>
        </div>
        <div className="context-workspace">
          <WorkspaceEnvironment appId={app.id} />
          {/* Постоянный контейнер отвечает за положение; меняются только действия внутри. */}
          <div className="context-wheel">
            <div aria-hidden="true" className="wheel-preview-glow pointer-events-none absolute inset-0 -z-10" />
            <ProfileWheel key={app.id} profile={app} hintId={hintId} />
          </div>
        </div>
      </div>

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
          className="context-switcher mx-auto grid w-fit max-w-full grid-cols-3 gap-1 rounded-control border border-border bg-surface/60 p-1"
          buttonClassName="min-h-11 gap-1.5 px-2 whitespace-nowrap sm:px-4"
        />
        <p className="context-disclaimer text-xs leading-relaxed text-secondary"><LocalizedText textKey="context.demoNotice" /></p>
      </div>
      <p id={hintId} className="sr-only">{t('hero.wheel.keyboardHint')}</p>
    </section>
  )
}
