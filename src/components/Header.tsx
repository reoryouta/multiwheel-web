import { useEffect, useRef, useState } from 'react'
import { Aperture, Download, Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { LocalizedText } from './LocalizedText'
import { microControlStyle } from '../lib/microMotion'
import { SectionLink } from './SectionLink'
import { useHeaderVisibility } from './useHeaderVisibility'
import './header.css'

export function Header() {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const hidden = useHeaderVisibility(headerRef, isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 64rem)')
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false)
    }
    desktopQuery.addEventListener('change', closeOnDesktop)
    return () => desktopQuery.removeEventListener('change', closeOnDesktop)
  }, [])

  const navigationItems = [
    { label: 'header.navigation.features', target: 'context' },
    { label: 'header.navigation.howItWorks', target: 'how-it-works' },
    { label: 'header.navigation.faq', target: 'faq' },
  ] as const

  return (
    <div className="header-space">
      <header
        ref={headerRef}
        data-hidden={hidden && !isMenuOpen}
        style={microControlStyle}
        className="site-header border-b border-border bg-background"
        onKeyDown={(event) => {
          if (event.key !== 'Escape' || !isMenuOpen) return
          event.preventDefault()
          event.stopPropagation()
          closeMenu()
          menuButtonRef.current?.focus({ preventScroll: true })
        }}
      >
        <div className="site-container grid grid-cols-[1fr_auto] items-center gap-x-8 lg:grid-cols-[auto_1fr_auto]">
          <SectionLink target="top" onNavigate={closeMenu} className="header-brand header-interactive flex min-h-24 items-center gap-3">
            <span className="header-brand-icon flex size-9 items-center justify-center rounded-control border border-accent/25 bg-accent/10 text-accent">
              <Aperture size={22} strokeWidth={1.7} aria-hidden="true" />
            </span>
            <span className="text-2xl font-semibold tracking-[-0.04em]">
              {t('header.brand')}
            </span>
          </SectionLink>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={t(isMenuOpen ? 'header.closeMenu' : 'header.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="header-content"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className="header-menu-button header-interactive flex size-11 cursor-pointer items-center justify-center rounded-control border border-border bg-surface text-primary lg:hidden"
          >
            {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>

          <div
            id="header-content"
            className={`${isMenuOpen ? 'flex' : 'hidden'} col-span-2 flex-col gap-6 border-t border-border py-6 lg:col-start-2 lg:row-start-1 lg:flex lg:flex-row lg:items-center lg:justify-between lg:border-0 lg:py-0`}
          >
            <nav
              aria-label={t('header.navigation.label')}
              className="flex flex-col gap-3 lg:mx-auto lg:flex-row lg:items-center lg:gap-4"
            >
              <ul className="flex flex-col gap-4 text-sm text-secondary lg:flex-row lg:items-center lg:gap-6">
                {navigationItems.map((item) => (
                  <li key={item.target}>
                    <SectionLink target={item.target} onNavigate={closeMenu} className="header-interactive inline-flex min-h-10 items-center rounded-sm">
                      <LocalizedText textKey={item.label} />
                    </SectionLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-wrap items-start gap-x-6 gap-y-5">
              <LanguageSwitcher />
              <div className="flex flex-col gap-1.5">
                <SectionLink
                  target="download"
                  onNavigate={closeMenu}
                  aria-describedby="download-status"
                  className="header-download header-interactive flex min-h-10 items-center justify-center gap-2 rounded-control border border-border bg-surface px-4 text-sm font-medium text-secondary"
                >
                  <Download size={16} aria-hidden="true" />
                  <LocalizedText textKey="header.download" />
                </SectionLink>
                <p id="download-status" className="text-xs text-secondary">
                  <LocalizedText textKey="header.downloadUnavailable" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
