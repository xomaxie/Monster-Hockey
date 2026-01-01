import { describe, it, expect } from 'vitest'
import { len, normalize, clampLen } from '../math'

describe('math vectors', () => {
  it('normalizes to unit length', () => {
    const unit = normalize({ x: 3, y: 4 })
    expect(len(unit)).toBeCloseTo(1)
  })

  it('clamps length without growing', () => {
    const clamped = clampLen({ x: 6, y: 8 }, 5)
    expect(len(clamped)).toBeCloseTo(5)
  })
})
