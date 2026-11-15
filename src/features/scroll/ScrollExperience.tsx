import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { HeroSection } from '../../components/HeroSection'
import { PhilosophySection } from '../../components/PhilosophySection'
import { WheelPreview } from '../../components/WheelPreview'
import { ScrollIndicator } from './ScrollIndicator'
import { scrollSceneConfig } from './scrollSceneConfig'
import { useScrollExperience } from './useScrollExperience'
import './scroll-experience.css'

export function ScrollExperience() {
  const scene = useScrollExperience()

  return (
    <div
      className={`scroll-experience ${scene.enhanced ? 'scroll-experience--enhanced' : ''}`}
      data-scroll-mode={scene.enhanced ? 'enhanced' : 'flow'}
      data-scroll-phase={scene.state.phase}
      style={{ '--scroll-distance': scrollSceneConfig.travelDistance } as CSSProperties}
    >
      <div ref={scene.trackRef} className="scroll-track">
        <div className="scroll-stage">
          <div className="site-container scroll-stage-content">
            <motion.div
              ref={scene.heroRef}
              initial={false}
              style={scene.heroStyle}
              aria-hidden={scene.state.heroHidden}
              inert={scene.state.heroHidden}
              className="scroll-hero-copy"
            >
              <HeroSection />
            </motion.div>

            <div ref={scene.wheelAnchorRef} className="scroll-wheel-anchor">
              {/* Этот контейнер двигается целиком. SVG-секторы анимируются внутри него. */}
              <motion.div
                initial={false}
                style={scene.wheelStyle}
                inert={!scene.state.interactive}
                className="scroll-wheel-motion"
              >
                <WheelPreview
                  visualRef={scene.wheelVisualRef}
                  interactive={scene.state.interactive}
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
        </div>
      </div>
    </div>
  )
}
