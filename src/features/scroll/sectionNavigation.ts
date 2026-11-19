import { animate } from 'motion'
import { beginDirectNavigation, endDirectNavigation } from './directNavigation'

export const sectionIds = ['top', 'about', 'how-it-works', 'context', 'download', 'faq'] as const
export type SectionId = (typeof sectionIds)[number]
export const sectionNavigationEvent = 'multiwheel:section-navigation'

export function sectionFromHash(): SectionId | undefined {
  return sectionIds.find((id) => window.location.hash === `#${id}`)
}

let stopActiveScroll: (() => void) | undefined

// Около 1.65 с для полного десктопного пути; короткие переходы быстрее.
// Корень даёт более спокойный рост длительности на длинных страницах.
function getScrollDuration(distance: number) {
  return Math.min(1.8, Math.max(0.45, 1.65 * Math.sqrt(Math.abs(distance) / 4000)))
}

// Один контракт для ссылок: сначала освобождаем How It Works, затем перемещаемся.
export function requestSectionNavigation(id: SectionId, { smooth = false }: { smooth?: boolean } = {}) {
  stopActiveScroll?.()
  const session = beginDirectNavigation('link', id)
  window.dispatchEvent(new CustomEvent<SectionId>(sectionNavigationEvent, { detail: id }))
  if (!smooth) {
    // Native anchors run after the click handler. Keep direct mode through their paint.
    requestAnimationFrame(() => requestAnimationFrame(() => endDirectNavigation(session)))
    return
  }

  const target = document.getElementById(id)
  if (!target) { endDirectNavigation(session); return }
  if (window.location.hash !== `#${id}`) window.history.pushState(window.history.state, '', `#${id}`)

  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
  const destination = id === 'top' ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - margin)
  const start = window.scrollY
  const distance = Math.abs(start - destination)
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  const finish = () => {
    target.focus({ preventScroll: true })
    endDirectNavigation(session)
  }
  if (preference.matches || distance < 1) {
    window.scrollTo({ top: destination, behavior: 'instant' })
    finish()
    return
  }

  let animation: { stop: () => void } | undefined
  const inputEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'blur', 'resize', 'hashchange'] as const
  function cleanup() {
    for (const event of inputEvents) window.removeEventListener(event, cancel, true)
    preference.removeEventListener('change', onPreferenceChange)
    if (stopActiveScroll === cancel) stopActiveScroll = undefined
  }
  function cancel() {
    animation?.stop()
    cleanup()
    endDirectNavigation(session)
  }
  function onPreferenceChange() {
    if (!preference.matches) return
    cancel()
    window.scrollTo({ top: destination, behavior: 'instant' })
    finish()
  }

  stopActiveScroll = cancel
  // Capture передаёт управление пользователю до wheel-обработчика последовательности.
  for (const event of inputEvents) window.addEventListener(event, cancel, { passive: true, capture: true })
  preference.addEventListener('change', onPreferenceChange)
  animation = animate(start, destination, {
    duration: getScrollDuration(distance),
    ease: 'easeInOut',
    onUpdate: (top) => window.scrollTo({ top, behavior: 'instant' }),
    onComplete: () => {
      cleanup()
      finish()
    },
  })
}
