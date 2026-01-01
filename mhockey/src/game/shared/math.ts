export type Vec2 = { x: number; y: number }

export const vec2 = (x = 0, y = 0): Vec2 => ({ x, y })

export const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y })
export const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y })
export const scale = (v: Vec2, s: number): Vec2 => ({ x: v.x * s, y: v.y * s })
export const len = (v: Vec2): number => Math.hypot(v.x, v.y)

export const normalize = (v: Vec2): Vec2 => {
  const length = len(v)
  if (length === 0) return { x: 0, y: 0 }
  return { x: v.x / length, y: v.y / length }
}

export const clampLen = (v: Vec2, maxLen: number): Vec2 => {
  const length = len(v)
  if (length <= maxLen) return v
  return scale(normalize(v), maxLen)
}
