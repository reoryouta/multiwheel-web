import { AppWindow } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { useTranslation } from 'react-i18next'

const reveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

const sequence: Variants = {
  visible: { transition: { staggerChildren: 0.08 } },
}

export function HeroSection() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.section
      aria-labelledby="hero-title"
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      variants={sequence}
      className="min-w-0"
    >
      <motion.div variants={sequence} className="min-w-0">
        <motion.p
          variants={reveal}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-secondary"
        >
          <AppWindow size={14} strokeWidth={1.5} aria-hidden="true" />
          {t('hero.platform')}
        </motion.p>

        <motion.h1
          id="hero-title"
          variants={reveal}
          className="text-[clamp(2.5rem,5.2vw,4rem)] leading-[1.08] font-semibold tracking-[-0.055em] text-balance"
        >
          <span className="block">{t('hero.titleLineOne')}</span>{' '}
          <span className="block text-primary/65">{t('hero.titleLineTwo')}</span>
        </motion.h1>

        <motion.p
          variants={reveal}
          className="mt-6 max-w-md text-base leading-relaxed text-secondary sm:text-lg"
        >
          {t('hero.description')}
        </motion.p>

        <motion.p variants={reveal} className="mt-8 flex items-center gap-2.5 text-sm font-medium text-secondary">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          {t('hero.availability')}
        </motion.p>
      </motion.div>

    </motion.section>
  )
}
