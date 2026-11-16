import { Aperture } from 'lucide-react'
import { wheelGeometry } from './wheelGeometry'
import type { WheelAction } from './wheelActions'
import { LocalizedText } from '../../components/LocalizedText'
import './wheel-center.css'

type WheelCenterProps = {
  action?: WheelAction
  brand: string
}

export function WheelCenter({ action, brand }: WheelCenterProps) {
  const { center, centerRadius, size } = wheelGeometry
  const Icon = action?.icon ?? Aperture

  return (
    <div
      aria-hidden="true"
      className="wheel-center"
      data-wheel-center-action={action?.id}
      style={{
        left: `${center / size * 100}%`,
        top: `${center / size * 100}%`,
        width: `${centerRadius * 2 / size * 100}%`,
      }}
    >
      <Icon className="wheel-center-icon" strokeWidth={1.25} />
      {/* Текст меняется в том же рендере, что и активный сектор, без очереди анимаций. */}
      <p className={action ? 'wheel-center-action' : 'wheel-center-brand'} data-wheel-label="">
        {action ? <LocalizedText textKey={action.labelKey} /> : brand}
      </p>
      {action && <p className="wheel-center-demo"><LocalizedText textKey="hero.wheel.demoLabel" /></p>}
    </div>
  )
}
