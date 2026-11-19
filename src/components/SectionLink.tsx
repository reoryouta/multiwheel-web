import type { AnchorHTMLAttributes } from 'react'
import { requestSectionNavigation, type SectionId } from '../features/scroll/sectionNavigation'

type SectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'onClick'> & {
  target: SectionId
  onNavigate?: () => void
  smooth?: boolean
}

export function SectionLink({ target, children, onNavigate, smooth = false, ...props }: SectionLinkProps) {
  return (
    <a
      href={`#${target}`}
      {...props}
      onClick={(event) => {
        if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
        if (smooth) event.preventDefault()
        requestSectionNavigation(target, { smooth })
        onNavigate?.()
      }}
    >{children}</a>
  )
}
