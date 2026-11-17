import { motion } from 'motion/react'
import { useRef, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { LocalizedText } from '../../components/LocalizedText'
import { controlTransitions, microControlStyle, microMotion, useMotionPreference } from '../../lib/microMotion'
import { scrollSceneConfig } from '../scroll/scrollSceneConfig'
import { useMediaQuery } from '../scroll/useMediaQuery'
import type { WheelProfile } from '../wheel/wheelProfiles'
import { HowItWorksWheel } from './HowItWorksWheel'
import { howItWorksConfig } from './howItWorksConfig'
import { useHowItWorksSequence } from './useHowItWorksSequence'
import './how-it-works.css'

const steps = ['howItWorks.press', 'howItWorks.select', 'howItWorks.continue'] as const

export function HowItWorksSection({ trackRef, profile }: { trackRef: RefObject<HTMLDivElement | null>; profile: WheelProfile }) {
  const { t } = useTranslation()
  const reduceMotion = useMotionPreference()
  const desktop = useMediaQuery(scrollSceneConfig.desktopQuery)
  const enhanced = desktop && !reduceMotion
  const sceneRef = useRef<HTMLElement>(null)
  const { step, busy, pinned, selectStep, skipSequence } = useHowItWorksSequence(trackRef, sceneRef, enhanced)
  const action = profile.actions[1] ?? profile.actions[0]

  return (
    <>
      <div ref={trackRef} id="how-it-works" tabIndex={-1} aria-labelledby="how-it-works-title" className={enhanced ? 'how-scene-track how-scene-track--enhanced outline-none' : 'how-scene-track outline-none'}>
        <section ref={sceneRef} aria-labelledby="how-it-works-title" aria-describedby="how-it-works-hint" className={`how-scene${enhanced ? ' how-scene--enhanced' : ''}${enhanced && pinned ? ' how-scene--pinned' : ''}`} data-how-step={step} data-how-mode={enhanced ? 'gestures' : 'simple'}>
          <h2 id="how-it-works-title" className="sr-only"><LocalizedText textKey="header.navigation.howItWorks" /></h2>
          <a href="#how-it-works-end" onClick={skipSequence} className="how-skip sr-only focus:not-sr-only"><LocalizedText textKey="howItWorks.skip" /></a>
          <div className="site-container how-layout">
            <div className="how-wheel-slot"><HowItWorksWheel profile={profile} step={step} reduceMotion={reduceMotion} /></div>
            <div className="min-w-0">
              <div className="how-steps">
                <div className="how-rail" aria-hidden="true">
                  <motion.div initial={false} animate={{ scaleY: Math.max(0, step - 1) / 2 }} transition={{ duration: reduceMotion ? 0 : howItWorksConfig.duration, ease: microMotion.ease }} className="how-rail-fill" />
                </div>
                <ol className="how-step-list">
                  {steps.map((textKey, index) => (
                    <li key={textKey} className="how-step">
                      <motion.span aria-hidden="true" initial={false} animate={{ backgroundColor: step === index + 1 ? 'var(--accent)' : 'var(--background)' }} transition={{ duration: reduceMotion ? 0 : microMotion.hover }} className="how-dot" />
                      <motion.button
                        type="button"
                        aria-current={step === index + 1 ? 'step' : undefined}
                        aria-disabled={busy}
                        onClick={() => selectStep(index + 1)}
                        initial={false}
                        animate={{ color: step === index + 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                        transition={controlTransitions(reduceMotion)}
                        style={microControlStyle}
                        className="micro-control how-step-button cursor-pointer text-left font-semibold"
                      ><LocalizedText textKey={textKey} /></motion.button>
                    </li>
                  ))}
                </ol>
              </div>
              <p id="how-it-works-hint" className={enhanced ? 'sr-only' : 'mt-6 text-sm leading-relaxed text-secondary'}>
                <LocalizedText textKey={enhanced ? 'howItWorks.keyboardHint' : 'howItWorks.simpleHint'} />
              </p>
              <p aria-live="polite" aria-atomic="true" className="sr-only">
                {step > 0 && t(steps[step - 1])}{step === 2 && action ? ` ${t('hero.wheel.actionLabel', { action: t(action.labelKey) })}` : ''}
              </p>
            </div>
          </div>
        </section>
      </div>
      <div id="how-it-works-end" tabIndex={-1} className="how-exit-space" />
    </>
  )
}
