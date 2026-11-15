import { MotionConfig } from 'motion/react'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { HomePage } from '../pages/HomePage'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
        <header className="flex justify-end">
          <LanguageSwitcher />
        </header>
        <main className="py-16 sm:py-24">
          <HomePage />
        </main>
      </div>
    </MotionConfig>
  )
}
