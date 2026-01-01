import { describe, it, expect } from 'vitest'
import { applySoftCap, applySkillCurve } from '../gear'

describe('gear curves', () => {
  it('applies a soft cap beyond 30%', () => {
    expect(applySoftCap(0.6, 0.3, 0.5)).toBeCloseTo(0.45)
  })

  it('scales gear by skill curve', () => {
    expect(applySkillCurve(0.5, 0, 0.4)).toBeCloseTo(0.2)
    expect(applySkillCurve(0.5, 200, 0.4)).toBeGreaterThan(0.45)
  })
})
