import { MotionConfig } from 'motion/react'
import { Header } from '../components/Header'
import { HomePage } from '../pages/HomePage'
import { LanguageTransitionProvider } from '../i18n/LanguageTransition'
import { Footer } from '../features/final/Footer'
import { NavigationInputObserver } from '../features/scroll/useDirectNavigation'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <NavigationInputObserver />
      <LanguageTransitionProvider>
        <div id="top" tabIndex={-1} className="outline-none"><Header /></div>
        <main>
          <HomePage />
        </main>
        <Footer />
      </LanguageTransitionProvider>
    </MotionConfig>
  )
}
