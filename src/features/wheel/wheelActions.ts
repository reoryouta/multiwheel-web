import {
  Clipboard,
  Copy,
  Folder,
  MousePointer2,
  Scissors,
  Search,
  Settings2,
  Undo2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ParseKeys } from 'i18next'

export type WheelAction = {
  id: string
  labelKey: ParseKeys
  icon: LucideIcon
}

// Это примеры для демонстрации, а не список функций приложения.
// Порядок элементов определяет их расположение по часовой стрелке.
export const wheelActions = [
  { id: 'select', labelKey: 'hero.wheel.actions.select', icon: MousePointer2 },
  { id: 'copy', labelKey: 'hero.wheel.actions.copy', icon: Copy },
  { id: 'paste', labelKey: 'hero.wheel.actions.paste', icon: Clipboard },
  { id: 'cut', labelKey: 'hero.wheel.actions.cut', icon: Scissors },
  { id: 'folder', labelKey: 'hero.wheel.actions.folder', icon: Folder },
  { id: 'search', labelKey: 'hero.wheel.actions.search', icon: Search },
  { id: 'settings', labelKey: 'hero.wheel.actions.settings', icon: Settings2 },
  { id: 'undo', labelKey: 'hero.wheel.actions.undo', icon: Undo2 },
] as const satisfies readonly WheelAction[]
