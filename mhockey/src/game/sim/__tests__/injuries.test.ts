import { describe, it, expect } from 'vitest'
import { rollInjury } from '../injuries'
import { createRng } from '../../shared/rng'

describe('injury rolls', () => {
  it('rolls deterministic injury for loser', () => {
    const rng = createRng(12345)
    const injury = rollInjury(rng, true, { loserChance: 1, winnerChance: 0 })
    expect(injury).toEqual({ bodyPart: 'head', type: 'sprain', matchesOut: 2 })
  })
})
