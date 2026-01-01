import { vec2 } from '../shared/math'
import { createClockState, type ClockState } from './clock'
import type { PuckState } from './stuckPuck'

export type MatchState = {
  clock: ClockState
  puck: PuckState
  score: { home: number; away: number }
  tick: number
}

export const createMatchState = (): MatchState => ({
  clock: createClockState(),
  puck: {
    pos: vec2(0, 0),
    vel: vec2(0, 0),
    stuckTicks: 0,
    lastRegion: 'center',
    lastTouchTeam: null,
  },
  score: { home: 0, away: 0 },
  tick: 0,
})
