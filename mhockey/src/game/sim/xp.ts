export type ActionType =
  | 'hit'
  | 'check'
  | 'stun'
  | 'goal'
  | 'assist'
  | 'save'
  | 'participation'
  | 'result'

type ActionCategory = 'spammy' | 'rare' | 'base'

const categories: Record<ActionType, ActionCategory> = {
  hit: 'spammy',
  check: 'spammy',
  stun: 'spammy',
  goal: 'rare',
  assist: 'rare',
  save: 'rare',
  participation: 'base',
  result: 'base',
}

const baseXp: Record<ActionType, number> = {
  hit: 5,
  check: 5,
  stun: 8,
  goal: 50,
  assist: 30,
  save: 20,
  participation: 10,
  result: 20,
}

const spammyMultiplier = (count: number): number => {
  if (count < 3) return 1
  if (count < 6) return 0.5
  return 0.1
}

export const xpForAction = (action: ActionType, countSoFar: number): number => {
  const category = categories[action]
  const base = baseXp[action]

  if (category === 'spammy') {
    return base * spammyMultiplier(countSoFar)
  }

  return base
}
