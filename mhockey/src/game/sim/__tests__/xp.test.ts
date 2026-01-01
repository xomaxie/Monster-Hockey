import { describe, it, expect } from 'vitest'
import { xpForAction } from '../xp'

describe('xp schedule', () => {
  it('diminishes spammy actions', () => {
    expect(xpForAction('hit', 0)).toBe(5)
    expect(xpForAction('hit', 3)).toBe(2.5)
    expect(xpForAction('hit', 6)).toBe(0.5)
  })

  it('does not diminish rare actions', () => {
    expect(xpForAction('goal', 10)).toBe(50)
  })
})
