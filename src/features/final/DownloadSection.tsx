import { Download } from 'lucide-react'
import { motion } from 'motion/react'
import { LocalizedRegion, LocalizedText } from '../../components/LocalizedText'
import { useMotionPreference } from '../../lib/microMotion'
import { DecorativeWheel } from './DecorativeWheel'
import { useLayoutEffect, useRef, useState } from 'react'
import { useDirectNavigation } from '../scroll/useDirectNavigation'

export function DownloadSection() {
  const reduceMotion = useMotionPreference()
  const { active: direct } = useDirectNavigation()
  const sectionRef = useRef<HTMLElement>(null)
  const [navigatedIntoView, setNavigatedIntoView] = useState(false)
  useLayoutEffect(() => {
    if (direct) return
    const rect = sectionRef.current?.getBoundingClientRect()
    if (rect && rect.bottom > 0 && rect.top < window.innerHeight) setNavigatedIntoView(true)
  }, [direct])
  const directEntrance = { opacity: 1, y: 0, transition: { type: false as const } }

  return (
    <motion.section
      ref={sectionRef}
      id="download"
      tabIndex={-1}
      aria-labelledby="final-download-title"
      className="final-download"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
      animate={direct ? 'direct' : navigatedIntoView ? 'visible' : undefined}
      whileInView={direct ? 'direct' : 'visible'}
      variants={{ visible: { opacity: 1, y: 0 }, direct: directEntrance }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduceMotion ? 0.14 : 0.3, ease: 'easeOut' }}
    >
      <div className="final-download-copy">
        <LocalizedRegion>
          {(t, measuring) => (
            <div>
              <p className="final-eyebrow">{t('final.download.eyebrow')}</p>
              <h2 id={measuring ? undefined : 'final-download-title'} className="scene-title final-download-title">
                <span className="block">{t('final.download.titleLineOne')}</span>{' '}
                <span className="block final-title-accent">{t('final.download.titleLineTwo')}</span>
              </h2>
              <p className="final-download-description">{t('final.download.description')}</p>
            </div>
          )}
        </LocalizedRegion>
        <div className="final-download-action">
          <button type="button" disabled aria-describedby="final-download-status" className="final-download-button">
            <Download size={18} strokeWidth={1.75} aria-hidden="true" />
            <LocalizedText textKey="final.download.button" />
          </button>
          <p id="final-download-status" className="final-download-status"><LocalizedText textKey="final.download.status" /></p>
        </div>
      </div>
      <motion.div
        className="final-wheel"
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
        animate={direct ? 'direct' : navigatedIntoView ? 'visible' : undefined}
        whileInView={direct ? 'direct' : 'visible'}
        variants={{ visible: { opacity: 1, scale: 1 }, direct: { opacity: 1, scale: 1, transition: { type: false } } }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: reduceMotion ? 0.14 : 0.3, delay: reduceMotion ? 0 : 0.1, ease: 'easeOut' }}
      >
        <DecorativeWheel />
      </motion.div>
    </motion.section>
  )
}
