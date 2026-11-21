import { motion } from 'motion/react'
import { memo, useRef, useState, type CSSProperties } from 'react'
import { HeroSection } from '../../components/HeroSection'
import { PhilosophySection } from '../../components/PhilosophySection'
import { WheelPreview } from '../../components/WheelPreview'
import { ScrollIndicator } from './ScrollIndicator'
import { scrollSceneConfig } from './scrollSceneConfig'
import { useScrollExperience } from './useScrollExperience'
import { HowItWorksSection } from '../how-it-works/HowItWorksSection'
import { ContextExperience } from '../context/ContextExperience'
import { FinalScreen } from '../final/FinalScreen'
import { useWheelHandoff } from '../how-it-works/useWheelHandoff'
import { wheelProfiles, type WheelProfile } from '../wheel/wheelProfiles'
import './scroll-experience.css'

// Изменение доступности Hero не требует обновления следующих сцен.
const HowScene = memo(HowItWorksSection)
const ContextScene = memo(ContextExperience)
const FinalScene = memo(FinalScreen)

export function ScrollExperience() {
  const trackRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const wheelAnchorRef = useRef<HTMLDivElement>(null)
  const wheelVisualRef = useRef<HTMLDivElement>(null)
  const scene = useScrollExperience({ trackRef, heroRef, wheelAnchorRef, wheelVisualRef })
  const howRef = useRef<HTMLDivElement>(null)
  const handoff = useWheelHandoff(howRef, scene.handoffEnabled)
  const [profile, setProfile] = useState<WheelProfile>(wheelProfiles[0])
  const interactive = scene.state.interactive && !handoff.leaving && !scene.direct

  return (
    <div
      className={`scroll-experience ${scene.enhanced ? 'scroll-experience--enhanced' : ''}`}
      data-scroll-mode={scene.enhanced ? 'enhanced' : 'flow'}
      data-scroll-phase={handoff.leaving ? 'how-it-works' : scene.state.phase}
      style={{ '--scroll-distance': scrollSceneConfig.travelDistance } as CSSProperties}
    >
      <div ref={trackRef} id="about" tabIndex={-1} aria-labelledby="hero-title" className="scroll-track outline-none">
        <motion.div className="scroll-stage" style={{ top: scene.returnInset }}>
          <div className="site-container scroll-stage-content">
            <motion.div
              ref={heroRef}
              initial={false}
              style={scene.heroStyle}
              aria-hidden={scene.state.heroHidden}
              inert={scene.state.heroHidden}
              className="scroll-hero-copy"
            >
              <HeroSection />
            </motion.div>

            <div ref={wheelAnchorRef} className="scroll-wheel-anchor">
              {/* Этот контейнер двигается целиком. SVG-секторы анимируются внутри него. */}
              <motion.div
                initial={false}
                style={scene.wheelStyle}
                inert={!interactive}
                className="scroll-wheel-motion"
              >
                <WheelPreview
                  visualRef={wheelVisualRef}
                  interactive={interactive}
                  visualStyle={handoff.style}
                  onProfileChange={setProfile}
                  controlsVisible={!scene.state.controlsHidden}
                  controlsStyle={scene.controlsStyle}
                />
              </motion.div>
            </div>

            <motion.div
              initial={false}
              style={scene.indicatorStyle}
              aria-hidden={scene.state.heroHidden}
              className="scroll-indicator"
            >
              <ScrollIndicator />
            </motion.div>

            <motion.div
              initial={false}
              style={scene.philosophyStyle}
              aria-hidden={scene.state.philosophyHidden}
              inert={scene.state.philosophyHidden}
              className="scroll-philosophy-copy"
            >
              <PhilosophySection />
            </motion.div>
          </div>
        </motion.div>
      </div>
      <HowScene trackRef={howRef} profile={profile} />
      <ContextScene />
      <FinalScene />
    </div>
  )
}
