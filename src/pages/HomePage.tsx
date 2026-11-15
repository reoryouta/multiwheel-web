import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.section
      aria-labelledby="home-title"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <h1 id="home-title" className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {t('app.name')}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
        {t('home.description')}
      </p>
    </motion.section>
  )
}
