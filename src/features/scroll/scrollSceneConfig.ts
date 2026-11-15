// Все интервалы заданы в долях естественного пути прокрутки: от 0 до 1.
export const scrollSceneConfig = {
  travelDistance: '140svh',
  desktopQuery: '(min-width: 1024px) and (min-height: 700px)',
  heroFade: [0.08, 0.38],
  wheelMove: [0.12, 0.82],
  philosophyFade: [0.55, 0.86],
  controlsFade: [0.06, 0.18],
  wheelEndScale: 0.66,
  heroInteractiveUntil: 0.08,
  philosophyInteractiveFrom: 0.9,
} as const

export function getSceneState(progress: number) {
  return {
    heroHidden: progress >= scrollSceneConfig.heroFade[1],
    philosophyHidden: progress <= scrollSceneConfig.philosophyFade[0],
    controlsHidden: progress >= scrollSceneConfig.controlsFade[1],
    interactive: progress <= scrollSceneConfig.heroInteractiveUntil || progress >= scrollSceneConfig.philosophyInteractiveFrom,
    phase: progress <= scrollSceneConfig.heroInteractiveUntil
      ? 'hero'
      : progress >= scrollSceneConfig.philosophyInteractiveFrom ? 'philosophy' : 'transition',
  }
}

export const flowSceneState = {
  heroHidden: false,
  philosophyHidden: false,
  controlsHidden: false,
  interactive: true,
  phase: 'flow',
}
