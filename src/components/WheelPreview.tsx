import { useId } from 'react'
import {
  Aperture,
  Clipboard,
  Copy,
  Folder,
  MousePointer2,
  Scissors,
  Search,
  Settings2,
  Undo2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

// Условные иконки для иллюстрации, а не список функций приложения.
const sectorIcons = [MousePointer2, Copy, Clipboard, Scissors, Folder, Search, Settings2, Undo2]
const center = 240
const outerRadius = 186
const innerRadius = 82

function pointOnCircle(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  }
}

function sectorPath(angle: number) {
  // Зазор в четыре градуса отделяет соседние секторы друг от друга.
  const startAngle = angle - 20.5
  const endAngle = angle + 20.5
  const outerStart = pointOnCircle(outerRadius, startAngle)
  const outerEnd = pointOnCircle(outerRadius, endAngle)
  const innerStart = pointOnCircle(innerRadius, startAngle)
  const innerEnd = pointOnCircle(innerRadius, endAngle)

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

export function WheelPreview() {
  const { t } = useTranslation()
  const id = useId()
  const surfaceGradientId = `${id}-surface`
  const accentGradientId = `${id}-accent`

  return (
    <figure className="mx-auto w-full max-w-[32rem]">
      <div className="relative isolate aspect-square">
        <div aria-hidden="true" className="wheel-preview-glow pointer-events-none absolute inset-0 -z-10" />
        <svg
          viewBox="0 0 480 480"
          role="img"
          aria-labelledby={`${id}-title ${id}-description`}
          className="pointer-events-none block size-full"
        >
          <title id={`${id}-title`}>{t('hero.wheel.title')}</title>
          <desc id={`${id}-description`}>{t('hero.wheel.description')}</desc>
          <defs>
            <linearGradient id={surfaceGradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--surface)" />
              <stop offset="100%" stopColor="var(--background)" />
            </linearGradient>
            <linearGradient id={accentGradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.36" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          <circle cx={center} cy={center} r="213" fill="none" stroke="var(--border)" strokeOpacity="0.5" />
          <circle cx={center} cy={center} r="202" fill="none" stroke="var(--border)" strokeOpacity="0.35" />

          {sectorIcons.map((Icon, index) => {
            const angle = -90 + index * 45
            const iconPosition = pointOnCircle(133, angle)
            // Один сектор выделен постоянно: у колеса нет интерактивных состояний.
            const isHighlighted = index === 1

            return (
              <g key={index} aria-hidden="true">
                <path
                  d={sectorPath(angle)}
                  fill={`url(#${isHighlighted ? accentGradientId : surfaceGradientId})`}
                  stroke={isHighlighted ? 'var(--accent)' : 'var(--border)'}
                  strokeOpacity={isHighlighted ? 0.55 : 0.8}
                  strokeWidth="1"
                />
                <Icon
                  x={iconPosition.x - 12}
                  y={iconPosition.y - 12}
                  size={24}
                  strokeWidth={1.5}
                  color={isHighlighted ? 'var(--text-primary)' : 'var(--text-secondary)'}
                />
              </g>
            )
          })}

          <circle cx={center} cy={center} r="66" fill="var(--background)" stroke="var(--border)" />
          <Aperture x="224" y="215" size={32} strokeWidth={1.25} color="var(--accent)" aria-hidden="true" />
          <text x={center} y="269" textAnchor="middle" fontSize="10" letterSpacing="1" fill="var(--text-secondary)" aria-hidden="true">
            {t('header.brand')}
          </text>
        </svg>
      </div>
      <figcaption className="mt-1 text-center text-xs text-secondary">
        {t('hero.wheel.caption')}
      </figcaption>
    </figure>
  )
}
