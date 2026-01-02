import { describe, it, expect } from 'vitest'
import { getRinkLayout } from '../rinkLayout'
import { getRinkShapes } from '../rinkShapes'

describe('getRinkShapes', () => {
  it('returns lines, circles, and debug entities', () => {
    const layout = getRinkLayout({ width: 1000, height: 600 })
    const shapes = getRinkShapes(layout)

    expect(shapes.lines).toHaveLength(5)
    expect(shapes.faceoffCircles).toHaveLength(4)
    expect(shapes.debugPlayers).toHaveLength(6)
    expect(shapes.debugPuck).toEqual({ x: layout.centerLineX, y: 300 })
    expect(shapes.debugMarkers).toHaveLength(2)
  })
})
