import type { LucideIcon } from 'lucide-react'
import { SegmentedControl } from '../../components/SegmentedControl'

type ProfileSwitcherProps = {
  profiles: readonly { id: string; name: string; icon: LucideIcon }[]
  selectedId: string
  onSelect: (id: string) => void
  label: string
  controlsId: string
}

export function ProfileSwitcher({ profiles, selectedId, onSelect, label, controlsId }: ProfileSwitcherProps) {
  return (
    <SegmentedControl
      items={profiles.map(({ id, name, icon }) => ({ id, label: name, icon }))}
      selectedId={selectedId}
      onSelect={onSelect}
      label={label}
      controlsId={controlsId}
      className="mx-auto grid w-fit max-w-full grid-cols-2 gap-1 rounded-control border border-border bg-surface/60 p-1 sm:grid-cols-4"
      buttonClassName="min-h-9 gap-1.5 px-2.5 whitespace-nowrap"
    />
  )
}
