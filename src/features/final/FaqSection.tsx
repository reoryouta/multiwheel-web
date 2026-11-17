import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { LocalizedText } from '../../components/LocalizedText'
import { microControlStyle, microMotion, useMotionPreference } from '../../lib/microMotion'

const questions = ['systems', 'customization', 'applications', 'release'] as const

function FaqItem({ item }: { item: (typeof questions)[number] }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const reduceMotion = useMotionPreference()

  return (
    <div className="final-faq-item">
      <h3>
        <button
          id={`${id}-question`}
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-answer`}
          onClick={() => setOpen((value) => !value)}
          className="final-faq-question micro-control"
          style={microControlStyle}
        >
          <LocalizedText textKey={`final.faq.${item}.question`} />
          <motion.span
            className="final-faq-icon"
            aria-hidden="true"
            initial={false}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: reduceMotion ? 0 : microMotion.hover, ease: microMotion.ease }}
          ><ChevronDown size={18} strokeWidth={1.75} /></motion.span>
        </button>
      </h3>
      <motion.div
        id={`${id}-answer`}
        role="region"
        aria-labelledby={`${id}-question`}
        aria-hidden={!open}
        inert={!open}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ height: { duration: reduceMotion ? 0 : microMotion.selection, ease: microMotion.ease }, opacity: { duration: microMotion.hover, ease: microMotion.ease } }}
        className="final-faq-answer"
      >
        <p className="final-faq-answer-copy"><LocalizedText textKey={`final.faq.${item}.answer`} /></p>
      </motion.div>
    </div>
  )
}

export function FaqSection() {
  return (
    <section id="faq" tabIndex={-1} aria-labelledby="final-faq-title" className="final-faq">
      <h2 id="final-faq-title" className="final-faq-title"><LocalizedText textKey="final.faq.title" /></h2>
      <div className="final-faq-list">{questions.map((item) => <FaqItem key={item} item={item} />)}</div>
    </section>
  )
}
