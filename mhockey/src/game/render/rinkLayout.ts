export type Size = { width: number; height: number }

export type RinkLayout = {
  bounds: { x: number; y: number; width: number; height: number; radius: number }
  centerLineX: number
  blueLineXs: [number, number]
  goalLineXs: [number, number]
  faceoffCircles: { x: number; y: number; radius: number }[]
}

export const getRinkLayout = ({ width, height }: Size): RinkLayout => {
  const margin = Math.max(24, Math.min(width, height) * 0.06)
  const rinkWidth = width - margin * 2
  const rinkHeight = height - margin * 2
  const x = margin
  const y = margin
  const radius = Math.min(60, rinkHeight * 0.18)

  const centerLineX = x + rinkWidth / 2
  const blueLineXs: [number, number] = [x + rinkWidth * 0.33, x + rinkWidth * 0.67]
  const goalLineXs: [number, number] = [x + rinkWidth * 0.08, x + rinkWidth * 0.92]
  const faceoffRadius = rinkHeight * 0.11

  const faceoffCircles = [
    { x: x + rinkWidth * 0.25, y: y + rinkHeight * 0.25, radius: faceoffRadius },
    { x: x + rinkWidth * 0.75, y: y + rinkHeight * 0.25, radius: faceoffRadius },
    { x: x + rinkWidth * 0.25, y: y + rinkHeight * 0.75, radius: faceoffRadius },
    { x: x + rinkWidth * 0.75, y: y + rinkHeight * 0.75, radius: faceoffRadius },
  ]

  return {
    bounds: { x, y, width: rinkWidth, height: rinkHeight, radius },
    centerLineX,
    blueLineXs,
    goalLineXs,
    faceoffCircles,
  }
}
