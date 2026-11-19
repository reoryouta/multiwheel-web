import { LocalizedRegion } from './LocalizedText'

export function PhilosophySection() {
  return (
    <section aria-labelledby="philosophy-title">
      <LocalizedRegion>
        {(t, measuring) => (
          <div>
            <p className="mb-7 text-xs font-medium tracking-[0.18em] text-accent">
              {t('philosophy.eyebrow')}
            </p>
            <h2 id={measuring ? undefined : 'philosophy-title'} className="scene-title philosophy-title">
              <span className="block">{t('philosophy.titleLineOne')}</span>{' '}
              <span className="block text-primary/65">{t('philosophy.titleLineTwo')}</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-secondary sm:text-lg">
              <span className="block">{t('philosophy.descriptionLineOne')}</span>{' '}
              <span className="block">{t('philosophy.descriptionLineTwo')}</span>
            </p>
          </div>
        )}
      </LocalizedRegion>
    </section>
  )
}
