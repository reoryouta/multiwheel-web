export const howItWorksConfig = {
  gestureQuietMs: 240,
  gestureThreshold: 24,
  duration: 0.32,
  closeDuration: 0.24,
  hiddenScale: 0.82,
} as const

// Один поток wheel-событий, включая инерционный хвост, даёт не больше одного шага.
export class WheelGestureGate {
  private lastTime = -Infinity
  private distance = 0
  private direction = 0
  mode: 'pending' | 'consumed' | 'released' = 'pending'

  feed(delta: number, now: number) {
    const direction = Math.sign(delta)
    // Outside the scene only the outward tail may bypass the entry boundary.
    if (now - this.lastTime > howItWorksConfig.gestureQuietMs ||
        (this.mode === 'released' && direction !== this.direction)) {
      this.reset()
    }
    this.lastTime = now
    if (this.mode !== 'pending') return 0
    if (direction !== this.direction) this.distance = 0
    this.direction = direction
    this.distance += Math.abs(delta)
    return this.distance >= howItWorksConfig.gestureThreshold ? direction : 0
  }

  consume(now: number) {
    this.lastTime = now
    this.mode = 'consumed'
  }

  release(direction: number, now: number) {
    this.direction = direction
    this.lastTime = now
    this.mode = 'released'
  }

  reset() {
    this.lastTime = -Infinity
    this.distance = 0
    this.direction = 0
    this.mode = 'pending'
  }
}
