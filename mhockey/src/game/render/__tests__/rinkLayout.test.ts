import { describe, it, expect } from 'vitest'
import { getRinkLayout } from '../rinkLayout'

describe('getRinkLayout', () => {
  it('derives rink bounds and lines from container size', () => {
    const layout = getRinkLayout({ width: 1000, height: 600 })

    expect(layout.bounds.x).toBeCloseTo(36)
    expect(layout.bounds.y).toBeCloseTo(36)
    expect(layout.bounds.width).toBeCloseTo(928)
    expect(layout.bounds.height).toBeCloseTo(528)
    expect(layout.centerLineX).toBeCloseTo(500)
    expect(layout.blueLineXs[0]).toBeCloseTo(342.24)
    expect(layout.blueLineXs[1]).toBeCloseTo(657.76)
    expect(layout.faceoffCircles).toHaveLength(4)
  })
})
