import { useState } from 'react'
import { Aperture, Download, Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    t('header.navigation.features'),
    t('header.navigation.howItWorks'),
    t('header.navigation.faq'),
  ]

  return (
    <header className="border-b border-border bg-background">
      <div className="site-container grid grid-cols-[1fr_auto] items-center gap-x-8 lg:grid-cols-[auto_1fr_auto]">
        <div className="flex min-h-24 items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-control border border-accent/25 bg-accent/10 text-accent">
            <Aperture size={22} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <span className="text-2xl font-semibold tracking-[-0.04em]">
            {t('header.brand')}
          </span>
        </div>

        <button
          type="button"
          aria-label={t(isMenuOpen ? 'header.closeMenu' : 'header.openMenu')}
          aria-expanded={isMenuOpen}
          aria-controls="header-content"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          className="flex size-11 cursor-pointer items-center justify-center rounded-control border border-border bg-surface text-primary hover:border-accent/50 lg:hidden"
        >
          {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>

        <div
          id="header-content"
          className={`${isMenuOpen ? 'flex' : 'hidden'} col-span-2 flex-col gap-6 border-t border-border py-6 lg:col-start-2 lg:row-start-1 lg:flex lg:flex-row lg:items-center lg:justify-between lg:border-0 lg:py-0`}
        >
          <nav
            aria-label={t('header.navigation.label')}
            aria-describedby="navigation-status"
            className="flex flex-col gap-3 lg:mx-auto lg:flex-row lg:items-center lg:gap-4"
          >
            <ul className="flex flex-col gap-4 text-sm text-secondary lg:flex-row lg:items-center lg:gap-6">
              {navigationItems.map((item) => (
                <li key={item}>
                  {/* Разделов пока нет: это текст, а не ссылки. */}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <span
              id="navigation-status"
              className="w-fit rounded-full border border-border px-2 py-0.5 text-xs text-secondary"
            >
              {t('header.navigation.comingSoon')}
            </span>
          </nav>

          <div className="flex flex-wrap items-start gap-x-6 gap-y-5">
            <LanguageSwitcher />
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                disabled
                aria-describedby="download-status"
                className="flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded-control border border-border bg-surface px-4 text-sm font-medium text-secondary"
              >
                <Download size={16} aria-hidden="true" />
                {t('header.download')}
              </button>
              <p id="download-status" className="text-xs text-secondary">
                {t('header.downloadUnavailable')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
