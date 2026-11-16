import { ArrowDown } from 'lucide-react'
import { LocalizedText } from '../../components/LocalizedText'

export function ScrollIndicator() {
  return (
    <p className="flex items-center justify-center gap-2 text-xs text-secondary">
      <LocalizedText textKey="scroll.continue" />
      <ArrowDown size={14} strokeWidth={1.5} aria-hidden="true" />
    </p>
  )
}
