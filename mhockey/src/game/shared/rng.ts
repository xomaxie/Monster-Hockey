export type Rng = {
  next: () => number
  int: (min: number, max: number) => number
}

export const createRng = (seed: number): Rng => {
  let state = seed >>> 0

  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }

  const int = (min: number, max: number) => {
    return Math.floor(next() * (max - min + 1)) + min
  }

  return { next, int }
}
