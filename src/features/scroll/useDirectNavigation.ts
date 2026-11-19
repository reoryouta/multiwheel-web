import { useLayoutEffect, useSyncExternalStore } from 'react'
import { getNavigationState, observeNavigationInput, subscribeNavigation } from './directNavigation'

export function useDirectNavigation() {
  return useSyncExternalStore(subscribeNavigation, getNavigationState, getNavigationState)
}

// Installed once, before the presentation controllers' passive effects.
export function NavigationInputObserver() {
  useLayoutEffect(observeNavigationInput, [])
  return null
}

