import type { ParseKeys } from 'i18next'
import {
  AlignHorizontalJustifyCenter,
  AppWindow,
  Braces,
  Code2,
  Component,
  CopyPlus,
  Crop,
  Eraser,
  Files,
  Frame,
  GitBranch,
  Group,
  Image,
  ImageDown,
  Layers,
  LayoutGrid,
  MessageSquareCode,
  Paintbrush,
  PenTool,
  Pipette,
  Play,
  Replace,
  Scan,
  SearchCode,
  SquareDashed,
  Terminal,
  Upload,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react'
import { wheelActions, type WheelAction } from './wheelActions'

export type WheelProfile = {
  id: string
  nameKey: ParseKeys
  descriptionKey: ParseKeys
  icon: LucideIcon
  actions: readonly WheelAction[]
}

// Концептуальные примеры. Здесь нет системных команд или интеграций с приложениями.
export const wheelProfiles = [
  {
    id: 'windows',
    nameKey: 'hero.wheel.profiles.windows.name',
    descriptionKey: 'hero.wheel.profiles.windows.description',
    icon: AppWindow,
    actions: wheelActions,
  },
  {
    id: 'figma',
    nameKey: 'hero.wheel.profiles.figma.name',
    descriptionKey: 'hero.wheel.profiles.figma.description',
    icon: PenTool,
    actions: [
      { id: 'frame', labelKey: 'hero.wheel.profiles.figma.actions.frame', icon: Frame },
      { id: 'component', labelKey: 'hero.wheel.profiles.figma.actions.component', icon: Component },
      { id: 'autoLayout', labelKey: 'hero.wheel.profiles.figma.actions.autoLayout', icon: LayoutGrid },
      { id: 'align', labelKey: 'hero.wheel.profiles.figma.actions.align', icon: AlignHorizontalJustifyCenter },
      { id: 'group', labelKey: 'hero.wheel.profiles.figma.actions.group', icon: Group },
      { id: 'duplicate', labelKey: 'hero.wheel.profiles.figma.actions.duplicate', icon: CopyPlus },
      { id: 'zoom', labelKey: 'hero.wheel.profiles.figma.actions.zoom', icon: ZoomIn },
      { id: 'export', labelKey: 'hero.wheel.profiles.figma.actions.export', icon: Upload },
    ],
  },
  {
    id: 'vscode',
    nameKey: 'hero.wheel.profiles.vscode.name',
    descriptionKey: 'hero.wheel.profiles.vscode.description',
    icon: Code2,
    actions: [
      { id: 'find', labelKey: 'hero.wheel.profiles.vscode.actions.find', icon: SearchCode },
      { id: 'files', labelKey: 'hero.wheel.profiles.vscode.actions.files', icon: Files },
      { id: 'terminal', labelKey: 'hero.wheel.profiles.vscode.actions.terminal', icon: Terminal },
      { id: 'format', labelKey: 'hero.wheel.profiles.vscode.actions.format', icon: Braces },
      { id: 'run', labelKey: 'hero.wheel.profiles.vscode.actions.run', icon: Play },
      { id: 'refactor', labelKey: 'hero.wheel.profiles.vscode.actions.refactor', icon: Replace },
      { id: 'comment', labelKey: 'hero.wheel.profiles.vscode.actions.comment', icon: MessageSquareCode },
      { id: 'git', labelKey: 'hero.wheel.profiles.vscode.actions.git', icon: GitBranch },
    ],
  },
  {
    id: 'photoshop',
    nameKey: 'hero.wheel.profiles.photoshop.name',
    descriptionKey: 'hero.wheel.profiles.photoshop.description',
    icon: Image,
    actions: [
      { id: 'brush', labelKey: 'hero.wheel.profiles.photoshop.actions.brush', icon: Paintbrush },
      { id: 'eraser', labelKey: 'hero.wheel.profiles.photoshop.actions.eraser', icon: Eraser },
      { id: 'crop', labelKey: 'hero.wheel.profiles.photoshop.actions.crop', icon: Crop },
      { id: 'layers', labelKey: 'hero.wheel.profiles.photoshop.actions.layers', icon: Layers },
      { id: 'selection', labelKey: 'hero.wheel.profiles.photoshop.actions.selection', icon: Scan },
      { id: 'eyedropper', labelKey: 'hero.wheel.profiles.photoshop.actions.eyedropper', icon: Pipette },
      { id: 'mask', labelKey: 'hero.wheel.profiles.photoshop.actions.mask', icon: SquareDashed },
      { id: 'export', labelKey: 'hero.wheel.profiles.photoshop.actions.export', icon: ImageDown },
    ],
  },
] as const satisfies readonly WheelProfile[]
