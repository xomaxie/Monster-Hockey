import type { Rng } from '../shared/rng'

export type BodyPart = 'head' | 'torso' | 'arm' | 'leg'
export type InjuryType = 'cut' | 'sprain' | 'fracture'

export type Injury = {
  bodyPart: BodyPart
  type: InjuryType
  matchesOut: number
}

export type InjuryConfig = {
  loserChance: number
  winnerChance: number
}

const bodyParts: BodyPart[] = ['head', 'torso', 'arm', 'leg']
const injuryTypes: InjuryType[] = ['cut', 'sprain', 'fracture']
const injuryDurations: Record<InjuryType, number> = {
  cut: 1,
  sprain: 2,
  fracture: 6,
}

export const rollInjury = (
  rng: Rng,
  loser: boolean,
  config: InjuryConfig = { loserChance: 0.35, winnerChance: 0.15 }
): Injury | null => {
  const chance = loser ? config.loserChance : config.winnerChance
  const roll = rng.next()
  if (roll > chance) return null

  const bodyPart = bodyParts[Math.floor(rng.next() * bodyParts.length)]
  const type = injuryTypes[Math.floor(rng.next() * injuryTypes.length)]
  return { bodyPart, type, matchesOut: injuryDurations[type] }
}
