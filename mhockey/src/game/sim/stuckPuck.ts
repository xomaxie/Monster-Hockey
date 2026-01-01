import { len, vec2 } from '../shared/math'
import type { Rng } from '../shared/rng'

export type RinkRegion = 'left' | 'center' | 'right'

export type StuckPuckConfig = {
  epsilonSpeed: number
  thresholdTicks: number
  popStrength: number
}

export type PuckState = {
  pos: { x: number; y: number }
  vel: { x: number; y: number }
  stuckTicks: number
  lastRegion: RinkRegion
  lastTouchTeam: 'home' | 'away' | null
}

export const updateStuckPuck = (
  puck: PuckState,
  region: RinkRegion,
  possessionChanged: boolean,
  rng: Rng,
  config: StuckPuckConfig
): void => {
  const speed = len(puck.vel)
  const isSlow = speed < config.epsilonSpeed

  if (possessionChanged || region !== puck.lastRegion || !isSlow) {
    puck.stuckTicks = 0
    puck.lastRegion = region
    return
  }

  puck.stuckTicks += 1
  puck.lastRegion = region

  if (puck.stuckTicks >= config.thresholdTicks) {
    const angle = rng.next() * Math.PI * 2
    puck.vel = vec2(Math.cos(angle) * config.popStrength, Math.sin(angle) * config.popStrength)
    puck.stuckTicks = 0
  }
}
