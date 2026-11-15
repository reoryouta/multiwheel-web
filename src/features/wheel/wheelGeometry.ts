// Все размеры заданы в координатах SVG, независимо от размера экрана.
export const wheelGeometry = {
  size: 480,
  center: 240,
  outerRadius: 186,
  innerRadius: 82,
  iconRadius: 133,
  centerRadius: 66,
  outerRingRadius: 213,
  innerRingRadius: 202,
  gapDegrees: 4,
}

function pointOnCircle(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180
  return {
    x: wheelGeometry.center + radius * Math.cos(radians),
    y: wheelGeometry.center + radius * Math.sin(radians),
  }
}

export function getSectorGeometry(index: number, count: number) {
  const { outerRadius, innerRadius, iconRadius, gapDegrees } = wheelGeometry
  const step = 360 / count
  const angle = -90 + index * step
  const gap = Math.min(gapDegrees, step * 0.2)
  const sweep = step - gap
  const startAngle = angle - sweep / 2
  const endAngle = angle + sweep / 2
  const outerStart = pointOnCircle(outerRadius, startAngle)
  const outerEnd = pointOnCircle(outerRadius, endAngle)
  const innerStart = pointOnCircle(innerRadius, startAngle)
  const innerEnd = pointOnCircle(innerRadius, endAngle)
  const largeArc = sweep > 180 ? 1 : 0

  return {
    iconPosition: pointOnCircle(iconRadius, angle),
    path: [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
      'Z',
    ].join(' '),
  }
}
