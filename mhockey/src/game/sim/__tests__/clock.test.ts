import { describe, it, expect } from 'vitest'
import { advanceClock, createClockState } from '../clock'

describe('match clock', () => {
  it('advances through periods and overtime', () => {
    const config = { periodMs: 1000, overtimeMs: 500 }
    const clock = createClockState()

    advanceClock(clock, 1000, config)
    expect(clock.period).toBe(2)
    expect(clock.phase).toBe('regulation')

    advanceClock(clock, 2000, config)
    expect(clock.period).toBe(4)
    expect(clock.phase).toBe('overtime')

    advanceClock(clock, 500, config)
    expect(clock.phase).toBe('final')
  })
})
