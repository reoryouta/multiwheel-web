import { MotionConfig } from 'motion/react'
import { Header } from '../components/Header'
import { HomePage } from '../pages/HomePage'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main>
        <HomePage />
      </main>
    </MotionConfig>
  )
}
