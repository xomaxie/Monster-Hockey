import { describe, it, expect } from 'vitest'
import { createRng } from '../rng'

describe('createRng', () => {
  it('is deterministic for the same seed', () => {
    const rng = createRng(12345)
    expect(rng.next()).toBeCloseTo(0.02040268573909998)
    expect(rng.next()).toBeCloseTo(0.01654784823767841)
    expect(rng.next()).toBeCloseTo(0.5431557944975793)
  })

  it('int is inclusive', () => {
    const rng = createRng(1)
    const value = rng.int(0, 2)
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThanOrEqual(2)
  })
})
