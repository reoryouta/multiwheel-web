import { Aperture, ArrowUp } from 'lucide-react'
import { LocalizedText } from '../../components/LocalizedText'
import { SectionLink } from '../../components/SectionLink'
import './final-screen.css'

export function Footer() {
  return (
    <footer className="final-footer site-container">
      <div className="final-footer-content">
        <div>
          <SectionLink target="top" className="final-footer-brand">
            <span className="flex size-9 items-center justify-center rounded-control border border-accent/25 bg-accent/10 text-accent"><Aperture size={22} strokeWidth={1.7} aria-hidden="true" /></span>
            <span className="text-2xl font-semibold tracking-[-0.04em]"><LocalizedText textKey="header.brand" /></span>
          </SectionLink>
          <p className="sr-only"><LocalizedText textKey="final.footer.windows" /></p>
        </div>
        <nav aria-labelledby="footer-product-title">
          <h2 id="footer-product-title" className="sr-only"><LocalizedText textKey="final.footer.product" /></h2>
          <ul className="final-footer-links">
            <li><SectionLink target="about"><LocalizedText textKey="final.footer.about" /></SectionLink></li>
            <li><SectionLink target="how-it-works"><LocalizedText textKey="header.navigation.howItWorks" /></SectionLink></li>
            <li><SectionLink target="context"><LocalizedText textKey="final.footer.context" /></SectionLink></li>
            <li><SectionLink target="faq"><LocalizedText textKey="header.navigation.faq" /></SectionLink></li>
            <li><SectionLink target="download"><LocalizedText textKey="final.footer.download" /></SectionLink></li>
          </ul>
        </nav>
      </div>
      <div className="final-footer-bottom">
        <p><LocalizedText textKey="final.footer.copyright" /></p>
        <SectionLink target="top" className="final-back-top"><LocalizedText textKey="final.footer.backToTop" /><ArrowUp size={16} strokeWidth={1.5} aria-hidden="true" /></SectionLink>
      </div>
    </footer>
  )
}
