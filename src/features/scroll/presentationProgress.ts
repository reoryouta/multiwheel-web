export type ProgressAnchor = { raw: number; visual: number }

// Resume from the visible endpoint after a direct jump into the middle of the track.
// Piecewise linear mapping is continuous in either direction and reaches both endpoints.
export function resumeProgress(raw: number, anchor?: ProgressAnchor) {
  if (!anchor) return raw
  if (raw >= anchor.raw) {
    return anchor.raw === 1 ? anchor.visual : anchor.visual + (1 - anchor.visual) * (raw - anchor.raw) / (1 - anchor.raw)
  }
  return anchor.raw === 0 ? anchor.visual : anchor.visual * raw / anchor.raw
}
