import { describe, it, expect } from 'vitest'
import { updateStuckPuck } from '../stuckPuck'
import { createRng } from '../../shared/rng'
import { vec2 } from '../../shared/math'

describe('stuck puck resolver', () => {
  it('pops the puck after threshold ticks', () => {
    const rng = createRng(1)
    const puck = {
      pos: vec2(0, 0),
      vel: vec2(0, 0),
      stuckTicks: 2,
      lastRegion: 'center',
      lastTouchTeam: null,
    }

    updateStuckPuck(puck, 'center', false, rng, {
      epsilonSpeed: 0.01,
      thresholdTicks: 3,
      popStrength: 2,
    })

    expect(puck.vel.x).toBeCloseTo(0.16999951421069437)
    expect(puck.vel.y).toBeCloseTo(1.992761943928107)
    expect(puck.stuckTicks).toBe(0)
  })
})
