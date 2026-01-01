import type { Rng } from '../shared/rng'
import { advanceClock, type ClockConfig } from './clock'
import type { MatchState } from './state'
import { updateStuckPuck, type StuckPuckConfig } from './stuckPuck'

export type MatchConfig = ClockConfig & { stuck: StuckPuckConfig }

export const tickMatch = (state: MatchState, dtMs: number, rng: Rng, config: MatchConfig): void => {
  state.tick += 1
  advanceClock(state.clock, dtMs, config)
  updateStuckPuck(state.puck, state.puck.lastRegion, false, rng, config.stuck)
}
