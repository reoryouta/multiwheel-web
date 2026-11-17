import type { ReactNode } from 'react'
import { requestSectionNavigation, type SectionId } from '../features/scroll/sectionNavigation'

export function SectionLink({ target, children, className }: { target: SectionId; children: ReactNode; className?: string }) {
  return (
    <a
      href={`#${target}`}
      className={className}
      onClick={(event) => {
        if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
        requestSectionNavigation(target)
      }}
    >{children}</a>
  )
}
