import type { RinkLayout } from './rinkLayout'

export type Line = { x1: number; y1: number; x2: number; y2: number; kind: 'center' | 'blue' | 'goal' }
export type Circle = { x: number; y: number; radius: number; kind: 'faceoff' }
export type DebugDot = { x: number; y: number; radius: number; kind: 'puck' | 'home' | 'away' }
export type DebugMarker = { x: number; y: number; radius: number; kind: 'captain' | 'possession' }

export type RinkShapes = {
  lines: Line[]
  faceoffCircles: Circle[]
  debugPlayers: DebugDot[]
  debugPuck: { x: number; y: number }
  debugMarkers: DebugMarker[]
}

export const getRinkShapes = (layout: RinkLayout): RinkShapes => {
  const { bounds, centerLineX, blueLineXs, goalLineXs, faceoffCircles } = layout
  const midY = bounds.y + bounds.height / 2

  const lines: Line[] = [
    { x1: centerLineX, y1: bounds.y, x2: centerLineX, y2: bounds.y + bounds.height, kind: 'center' },
    { x1: blueLineXs[0], y1: bounds.y, x2: blueLineXs[0], y2: bounds.y + bounds.height, kind: 'blue' },
    { x1: blueLineXs[1], y1: bounds.y, x2: blueLineXs[1], y2: bounds.y + bounds.height, kind: 'blue' },
    { x1: goalLineXs[0], y1: bounds.y, x2: goalLineXs[0], y2: bounds.y + bounds.height, kind: 'goal' },
    { x1: goalLineXs[1], y1: bounds.y, x2: goalLineXs[1], y2: bounds.y + bounds.height, kind: 'goal' },
  ]

  const debugPuck = { x: centerLineX, y: midY }

  const debugPlayers: DebugDot[] = [
    { x: centerLineX - bounds.width * 0.18, y: midY - bounds.height * 0.18, radius: 10, kind: 'home' },
    { x: centerLineX - bounds.width * 0.18, y: midY + bounds.height * 0.18, radius: 10, kind: 'home' },
    { x: centerLineX - bounds.width * 0.32, y: midY, radius: 10, kind: 'home' },
    { x: centerLineX + bounds.width * 0.18, y: midY - bounds.height * 0.18, radius: 10, kind: 'away' },
    { x: centerLineX + bounds.width * 0.18, y: midY + bounds.height * 0.18, radius: 10, kind: 'away' },
    { x: centerLineX + bounds.width * 0.32, y: midY, radius: 10, kind: 'away' },
  ]

  const debugMarkers: DebugMarker[] = [
    {
      x: debugPlayers[0].x,
      y: debugPlayers[0].y,
      radius: debugPlayers[0].radius + 6,
      kind: 'captain',
    },
    {
      x: debugPlayers[2].x,
      y: debugPlayers[2].y,
      radius: debugPlayers[2].radius + 4,
      kind: 'possession',
    },
  ]

  return {
    lines,
    faceoffCircles: faceoffCircles.map((circle) => ({ ...circle, kind: 'faceoff' })),
    debugPlayers,
    debugPuck,
    debugMarkers,
  }
}
