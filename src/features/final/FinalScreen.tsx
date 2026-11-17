import { DownloadSection } from './DownloadSection'
import { FaqSection } from './FaqSection'
import './final-screen.css'

export function FinalScreen() {
  return (
    <div className="final-screen site-container">
      <DownloadSection />
      <FaqSection />
    </div>
  )
}
