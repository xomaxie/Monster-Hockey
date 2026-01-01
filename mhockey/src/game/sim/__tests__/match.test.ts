import { describe, it, expect } from 'vitest'
import { createMatchState } from '../state'
import { tickMatch } from '../tick'
import { createRng } from '../../shared/rng'

describe('match tick', () => {
  it('advances the clock and tick count', () => {
    const config = {
      periodMs: 1000,
      overtimeMs: 500,
      stuck: { epsilonSpeed: 0.01, thresholdTicks: 3, popStrength: 2 },
    }
    const state = createMatchState()
    const rng = createRng(1)

    tickMatch(state, 1000, rng, config)
    expect(state.clock.period).toBe(2)
    expect(state.tick).toBe(1)
  })
})
