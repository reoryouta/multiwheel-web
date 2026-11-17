export const sectionIds = ['top', 'about', 'how-it-works', 'context', 'download', 'faq'] as const
export type SectionId = (typeof sectionIds)[number]
export const sectionNavigationEvent = 'multiwheel:section-navigation'

export function sectionFromHash(): SectionId | undefined {
  return sectionIds.find((id) => window.location.hash === `#${id}`)
}

// Перед нативным переходом контроллер шагов получает возможность освободить сцену.
export function requestSectionNavigation(id: SectionId) {
  window.dispatchEvent(new CustomEvent<SectionId>(sectionNavigationEvent, { detail: id }))
}
