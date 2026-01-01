import type { Vec2 } from './math'

export type Command =
  | { type: 'move'; playerId: string; dir: Vec2 }
  | { type: 'shoot'; playerId: string; target: Vec2 }
  | { type: 'pass'; playerId: string; target: Vec2 }
  | { type: 'lightHit'; playerId: string }
  | { type: 'heavyHit'; playerId: string }
  | { type: 'raceSkill'; playerId: string }
  | { type: 'captainCommand'; playerId: string }
