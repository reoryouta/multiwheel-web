import { frame } from 'motion'

type DirectSource = 'link' | 'scrollbar' | 'history' | 'native'
type NavigationState = { active: boolean; source?: DirectSource; target?: string; session: number }
const presentation: NavigationState = { active: false, session: 0 }
let state = presentation
let settledLinkY: number | undefined
const listeners = new Set<() => void>()
const positions = new Set<() => void>()

export const getNavigationState = () => state
export function subscribeNavigation(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
export function subscribeDirectPosition(listener: () => void) {
  positions.add(listener)
  return () => { positions.delete(listener) }
}

export function beginDirectNavigation(source: DirectSource, target?: string) {
  settledLinkY = undefined
  state = { active: true, source, target, session: state.session + 1 }
  // CSS applies the stable composition before the browser's next native scroll paint.
  document.documentElement.dataset.navigationMode = 'direct'
  listeners.forEach((listener) => listener())
  return state.session
}

export function endDirectNavigation(session = state.session) {
  if (!state.active || session !== state.session) return
  if (state.source === 'link') settledLinkY = window.scrollY
  state = { active: false, session }
  listeners.forEach((listener) => listener())
  // Let Motion render the synchronized values before removing the native-scroll override.
  frame.postRender(() => {
    if (!state.active && state.session === session) delete document.documentElement.dataset.navigationMode
  })
}

// Observes ownership only: never prevents an input or changes the scroll position.
// In particular, wheel intensity and distance are NOT navigation-source heuristics.
export function observeNavigationInput() {
  let input: 'presentation' | 'native' = 'native'
  let scrollbarHeld = false
  let settlement = 0
  const afterNativeJump = () => {
    cancelAnimationFrame(settlement)
    const session = state.session
    settlement = requestAnimationFrame(() => {
      settlement = requestAnimationFrame(() => endDirectNavigation(session))
    })
  }
  const resumePresentation = () => {
    input = 'presentation'
    scrollbarHeld = false
    endDirectNavigation()
  }
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    resumePresentation()
  }
  const onKey = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return
    const target = event.target as HTMLElement
    if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '].includes(event.key)) resumePresentation()
    if (['Home', 'End'].includes(event.key)) {
      input = 'native'
      beginDirectNavigation('native')
      afterNativeJump()
    }
  }
  const onPointerDown = (event: MouseEvent) => {
    input = 'native'
    const root = document.documentElement
    if (event.clientX >= root.clientWidth || event.clientX < root.clientLeft || event.clientY >= root.clientHeight) {
      scrollbarHeld = true
      beginDirectNavigation('scrollbar')
    }
  }
  const onPointerOut = (event: MouseEvent) => {
    // Chromium's native scrollbar need not dispatch pointerdown into the document.
    if (!event.relatedTarget) input = 'native'
  }
  const onPointerUp = () => {
    scrollbarHeld = false
    if (state.source === 'scrollbar' || state.source === 'native') afterNativeJump()
  }
  const onScroll = () => {
    // The final scrollTo can deliver its scroll event after completion or cancellation.
    // A native move to a different position still takes ownership immediately.
    const linkPosition = settledLinkY
    settledLinkY = undefined
    if (!state.active && input === 'native' && window.scrollY !== linkPosition) beginDirectNavigation('native')
    if (state.active) positions.forEach((listener) => listener())
  }
  const onScrollEnd = () => {
    // Numeric smooth navigation owns its lifecycle, not each scrollTo frame's scrollend.
    if (!scrollbarHeld && state.active && state.source !== 'link') endDirectNavigation()
  }
  const onHistory = () => {
    input = 'native'
    if (state.source !== 'link') beginDirectNavigation('history', window.location.hash.slice(1))
    afterNativeJump()
  }
  const onBlur = () => { input = 'native'; onPointerUp() }
  window.addEventListener('wheel', onWheel, { passive: true, capture: true })
  window.addEventListener('touchstart', resumePresentation, { passive: true, capture: true })
  window.addEventListener('keydown', onKey, true)
  window.addEventListener('pointerdown', onPointerDown, true)
  window.addEventListener('mousedown', onPointerDown, true)
  window.addEventListener('pointerout', onPointerOut)
  window.addEventListener('mouseout', onPointerOut)
  window.addEventListener('pointerup', onPointerUp, true)
  window.addEventListener('mouseup', onPointerUp, true)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('scrollend', onScrollEnd)
  window.addEventListener('hashchange', onHistory)
  window.addEventListener('popstate', onHistory)
  window.addEventListener('blur', onBlur)
  if (window.location.hash || window.scrollY > 0) {
    beginDirectNavigation('history', window.location.hash.slice(1))
    afterNativeJump()
  }
  return () => {
    cancelAnimationFrame(settlement)
    window.removeEventListener('wheel', onWheel, true)
    window.removeEventListener('touchstart', resumePresentation, true)
    window.removeEventListener('keydown', onKey, true)
    window.removeEventListener('pointerdown', onPointerDown, true)
    window.removeEventListener('mousedown', onPointerDown, true)
    window.removeEventListener('pointerout', onPointerOut)
    window.removeEventListener('mouseout', onPointerOut)
    window.removeEventListener('pointerup', onPointerUp, true)
    window.removeEventListener('mouseup', onPointerUp, true)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('scrollend', onScrollEnd)
    window.removeEventListener('hashchange', onHistory)
    window.removeEventListener('popstate', onHistory)
    window.removeEventListener('blur', onBlur)
    endDirectNavigation()
  }
}
