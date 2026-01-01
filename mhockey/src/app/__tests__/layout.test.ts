import { describe, it, expect } from 'vitest'
import { getLayoutData } from '../layout'

describe('layout data', () => {
  it('returns data-mode and data-phase attributes', () => {
    expect(getLayoutData('match', 'live')).toEqual({ 'data-mode': 'match', 'data-phase': 'live' })
  })
})
