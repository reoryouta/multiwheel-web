import { MotionConfig } from 'motion/react'
import { Header } from '../components/Header'
import { HomePage } from '../pages/HomePage'
import { LanguageTransitionProvider } from '../i18n/LanguageTransition'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageTransitionProvider>
        <Header />
        <main>
          <HomePage />
        </main>
      </LanguageTransitionProvider>
    </MotionConfig>
  )
}
