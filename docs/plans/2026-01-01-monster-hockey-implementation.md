# Monster Hockey Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a deterministic sim core and scaffolding (commands, facade, scene loop) that can support the v1 match rules and future render changes.

**Architecture:** Sim-first core with fixed timestep in `mhockey/src/game/sim`, renderer and scenes as separate layers. React is a thin shell over the facade snapshots/events. We keep the existing Vite root and wire `src/App.tsx` to the `mhockey/src/app/App.tsx` shell.

**Tech Stack:** TypeScript, React, Vite, Pixi.js, Vitest.

### Task 1: Add Vitest + include mhockey sources

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`
- Modify: `tsconfig.app.json`
- Create: `mhockey/src/game/shared/__tests__/vitest-smoke.test.ts`

**Step 1: Add Vitest config and script**

Update `package.json`:

```json
{
  "scripts": {
    "test": "vitest --run"
  },
  "devDependencies": {
    "vitest": "^2.1.0"
  }
}
```

Update `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "types": ["vite/client", "vitest"]
  },
  "include": ["src", "mhockey/src"]
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['mhockey/src/**/*.test.ts'],
  },
})
```

**Step 2: Write a failing smoke test**

```ts
import { describe, it, expect } from 'vitest'

describe('vitest harness', () => {
  it('runs in node', () => {
    expect(1).toBe(2)
  })
})
```

**Step 3: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/shared/__tests__/vitest-smoke.test.ts`  
Expected: FAIL with assertion `expected 1 to be 2`

**Step 4: Fix the test**

```ts
expect(1).toBe(1)
```

**Step 5: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/shared/__tests__/vitest-smoke.test.ts`  
Expected: PASS

**Step 6: Commit**

```bash
git add package.json tsconfig.app.json vitest.config.ts mhockey/src/game/shared/__tests__/vitest-smoke.test.ts
git commit -m "chore: add vitest harness"
```

### Task 2: Deterministic RNG helper

**Files:**
- Create: `mhockey/src/game/shared/rng.ts`
- Create: `mhockey/src/game/shared/__tests__/rng.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { createRng } from '../rng'

describe('createRng', () => {
  it('is deterministic for the same seed', () => {
    const rng = createRng(12345)
    expect(rng.next()).toBeCloseTo(0.02040268573909998)
    expect(rng.next()).toBeCloseTo(0.01654784823767841)
    expect(rng.next()).toBeCloseTo(0.5431557944975793)
  })

  it('int is inclusive', () => {
    const rng = createRng(1)
    const value = rng.int(0, 2)
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThanOrEqual(2)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/shared/__tests__/rng.test.ts`  
Expected: FAIL with "Cannot find module '../rng'"

**Step 3: Write minimal implementation**

```ts
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
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/shared/__tests__/rng.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/shared/rng.ts mhockey/src/game/shared/__tests__/rng.test.ts
git commit -m "feat: add deterministic rng helper"
```

### Task 3: Vec2 math utilities

**Files:**
- Create: `mhockey/src/game/shared/math.ts`
- Create: `mhockey/src/game/shared/__tests__/math.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { len, normalize, clampLen } from '../math'

describe('math vectors', () => {
  it('normalizes to unit length', () => {
    const unit = normalize({ x: 3, y: 4 })
    expect(len(unit)).toBeCloseTo(1)
  })

  it('clamps length without growing', () => {
    const clamped = clampLen({ x: 6, y: 8 }, 5)
    expect(len(clamped)).toBeCloseTo(5)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/shared/__tests__/math.test.ts`  
Expected: FAIL with "Cannot find module '../math'"

**Step 3: Write minimal implementation**

```ts
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
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/shared/__tests__/math.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/shared/math.ts mhockey/src/game/shared/__tests__/math.test.ts
git commit -m "feat: add vec2 math helpers"
```

### Task 4: Match clock and period transitions

**Files:**
- Create: `mhockey/src/game/sim/clock.ts`
- Create: `mhockey/src/game/sim/__tests__/clock.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { advanceClock, createClockState } from '../clock'

describe('match clock', () => {
  it('advances through periods and overtime', () => {
    const config = { periodMs: 1000, overtimeMs: 500 }
    const clock = createClockState()

    advanceClock(clock, 1000, config)
    expect(clock.period).toBe(2)
    expect(clock.phase).toBe('regulation')

    advanceClock(clock, 2000, config)
    expect(clock.period).toBe(4)
    expect(clock.phase).toBe('overtime')

    advanceClock(clock, 500, config)
    expect(clock.phase).toBe('final')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/sim/__tests__/clock.test.ts`  
Expected: FAIL with "Cannot find module '../clock'"

**Step 3: Write minimal implementation**

```ts
export type MatchPhase = 'regulation' | 'overtime' | 'final'

export type ClockConfig = {
  periodMs: number
  overtimeMs: number
}

export type ClockState = {
  period: number
  clockMs: number
  phase: MatchPhase
}

export const createClockState = (): ClockState => ({
  period: 1,
  clockMs: 0,
  phase: 'regulation',
})

export const advanceClock = (state: ClockState, dtMs: number, config: ClockConfig): void => {
  if (state.phase === 'final') return

  state.clockMs += dtMs

  if (state.phase === 'regulation') {
    while (state.clockMs >= config.periodMs && state.period <= 3) {
      state.clockMs -= config.periodMs
      state.period += 1
    }

    if (state.period > 3) {
      state.phase = 'overtime'
      state.period = 4
    }
  }

  if (state.phase === 'overtime' && state.clockMs >= config.overtimeMs) {
    state.clockMs = config.overtimeMs
    state.phase = 'final'
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/sim/__tests__/clock.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/sim/clock.ts mhockey/src/game/sim/__tests__/clock.test.ts
git commit -m "feat: add match clock transitions"
```

### Task 5: Stuck puck resolver

**Files:**
- Create: `mhockey/src/game/sim/stuckPuck.ts`
- Create: `mhockey/src/game/sim/__tests__/stuckPuck.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { updateStuckPuck } from '../stuckPuck'
import { createRng } from '../../shared/rng'
import { vec2 } from '../../shared/math'

describe('stuck puck resolver', () => {
  it('pops the puck after threshold ticks', () => {
    const rng = createRng(1)
    const puck = {
      pos: vec2(0, 0),
      vel: vec2(0, 0),
      stuckTicks: 2,
      lastRegion: 'center',
      lastTouchTeam: null,
    }

    updateStuckPuck(puck, 'center', false, rng, {
      epsilonSpeed: 0.01,
      thresholdTicks: 3,
      popStrength: 2,
    })

    expect(puck.vel.x).toBeCloseTo(0.16999951421069437)
    expect(puck.vel.y).toBeCloseTo(1.992761943928107)
    expect(puck.stuckTicks).toBe(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/sim/__tests__/stuckPuck.test.ts`  
Expected: FAIL with "Cannot find module '../stuckPuck'"

**Step 3: Write minimal implementation**

```ts
import { len, vec2 } from '../shared/math'
import type { Rng } from '../shared/rng'

export type RinkRegion = 'left' | 'center' | 'right'

export type StuckPuckConfig = {
  epsilonSpeed: number
  thresholdTicks: number
  popStrength: number
}

export type PuckState = {
  pos: { x: number; y: number }
  vel: { x: number; y: number }
  stuckTicks: number
  lastRegion: RinkRegion
  lastTouchTeam: 'home' | 'away' | null
}

export const updateStuckPuck = (
  puck: PuckState,
  region: RinkRegion,
  possessionChanged: boolean,
  rng: Rng,
  config: StuckPuckConfig
): void => {
  const speed = len(puck.vel)
  const isSlow = speed < config.epsilonSpeed

  if (possessionChanged || region !== puck.lastRegion || !isSlow) {
    puck.stuckTicks = 0
    puck.lastRegion = region
    return
  }

  puck.stuckTicks += 1
  puck.lastRegion = region

  if (puck.stuckTicks >= config.thresholdTicks) {
    const angle = rng.next() * Math.PI * 2
    puck.vel = vec2(Math.cos(angle) * config.popStrength, Math.sin(angle) * config.popStrength)
    puck.stuckTicks = 0
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/sim/__tests__/stuckPuck.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/sim/stuckPuck.ts mhockey/src/game/sim/__tests__/stuckPuck.test.ts
git commit -m "feat: add stuck puck resolver"
```

### Task 6: Injury roll model

**Files:**
- Create: `mhockey/src/game/sim/injuries.ts`
- Create: `mhockey/src/game/sim/__tests__/injuries.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { rollInjury } from '../injuries'
import { createRng } from '../../shared/rng'

describe('injury rolls', () => {
  it('rolls deterministic injury for loser', () => {
    const rng = createRng(12345)
    const injury = rollInjury(rng, true, { loserChance: 1, winnerChance: 0 })
    expect(injury).toEqual({ bodyPart: 'head', type: 'sprain', matchesOut: 2 })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/sim/__tests__/injuries.test.ts`  
Expected: FAIL with "Cannot find module '../injuries'"

**Step 3: Write minimal implementation**

```ts
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
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/sim/__tests__/injuries.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/sim/injuries.ts mhockey/src/game/sim/__tests__/injuries.test.ts
git commit -m "feat: add deterministic injury rolls"
```

### Task 7: XP diminishing by action category

**Files:**
- Create: `mhockey/src/game/sim/xp.ts`
- Create: `mhockey/src/game/sim/__tests__/xp.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { xpForAction } from '../xp'

describe('xp schedule', () => {
  it('diminishes spammy actions', () => {
    expect(xpForAction('hit', 0)).toBe(5)
    expect(xpForAction('hit', 3)).toBe(2.5)
    expect(xpForAction('hit', 6)).toBe(0.5)
  })

  it('does not diminish rare actions', () => {
    expect(xpForAction('goal', 10)).toBe(50)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/sim/__tests__/xp.test.ts`  
Expected: FAIL with "Cannot find module '../xp'"

**Step 3: Write minimal implementation**

```ts
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
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/sim/__tests__/xp.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/sim/xp.ts mhockey/src/game/sim/__tests__/xp.test.ts
git commit -m "feat: add xp diminishing schedule"
```

### Task 8: Gear bonus curves

**Files:**
- Create: `mhockey/src/game/shared/gear.ts`
- Create: `mhockey/src/game/shared/__tests__/gear.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { applySoftCap, applySkillCurve } from '../gear'

describe('gear curves', () => {
  it('applies a soft cap beyond 30%', () => {
    expect(applySoftCap(0.6, 0.3, 0.5)).toBeCloseTo(0.45)
  })

  it('scales gear by skill curve', () => {
    expect(applySkillCurve(0.5, 0, 0.4)).toBeCloseTo(0.2)
    expect(applySkillCurve(0.5, 200, 0.4)).toBeGreaterThan(0.45)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/shared/__tests__/gear.test.ts`  
Expected: FAIL with "Cannot find module '../gear'"

**Step 3: Write minimal implementation**

```ts
export const applySoftCap = (bonus: number, softCap = 0.3, excessFactor = 0.5): number => {
  if (bonus <= softCap) return bonus
  return softCap + (bonus - softCap) * excessFactor
}

export const skillCurve = (skill: number, k = 50): number => {
  return 1 - Math.exp(-skill / k)
}

export const applySkillCurve = (gearBonus: number, skill: number, minScale = 0.4): number => {
  return gearBonus * (minScale + (1 - minScale) * skillCurve(skill))
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/shared/__tests__/gear.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/shared/gear.ts mhockey/src/game/shared/__tests__/gear.test.ts
git commit -m "feat: add gear bonus curves"
```

### Task 9: Match state + tick skeleton

**Files:**
- Create: `mhockey/src/game/sim/state.ts`
- Create: `mhockey/src/game/sim/tick.ts`
- Create: `mhockey/src/game/sim/__tests__/match.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { createMatchState } from '../state'
import { tickMatch } from '../tick'
import { createRng } from '../../shared/rng'

describe('match tick', () => {
  it('advances the clock and tick count', () => {
    const config = {
      periodMs: 1000,
      overtimeMs: 500,
      stuck: { epsilonSpeed: 0.01, thresholdTicks: 3, popStrength: 2 },
    }
    const state = createMatchState()
    const rng = createRng(1)

    tickMatch(state, 1000, rng, config)
    expect(state.clock.period).toBe(2)
    expect(state.tick).toBe(1)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/sim/__tests__/match.test.ts`  
Expected: FAIL with "Cannot find module '../state'"

**Step 3: Write minimal implementation**

`mhockey/src/game/sim/state.ts`:

```ts
import { vec2 } from '../shared/math'
import { createClockState, type ClockState } from './clock'
import type { PuckState } from './stuckPuck'

export type MatchState = {
  clock: ClockState
  puck: PuckState
  score: { home: number; away: number }
  tick: number
}

export const createMatchState = (): MatchState => ({
  clock: createClockState(),
  puck: {
    pos: vec2(0, 0),
    vel: vec2(0, 0),
    stuckTicks: 0,
    lastRegion: 'center',
    lastTouchTeam: null,
  },
  score: { home: 0, away: 0 },
  tick: 0,
})
```

`mhockey/src/game/sim/tick.ts`:

```ts
import type { Rng } from '../shared/rng'
import { advanceClock, type ClockConfig } from './clock'
import type { MatchState } from './state'
import { updateStuckPuck, type StuckPuckConfig } from './stuckPuck'

export type MatchConfig = ClockConfig & { stuck: StuckPuckConfig }

export const tickMatch = (state: MatchState, dtMs: number, rng: Rng, config: MatchConfig): void => {
  state.tick += 1
  advanceClock(state.clock, dtMs, config)
  updateStuckPuck(state.puck, state.puck.lastRegion, false, rng, config.stuck)
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/sim/__tests__/match.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/sim/state.ts mhockey/src/game/sim/tick.ts mhockey/src/game/sim/__tests__/match.test.ts
git commit -m "feat: add match state and tick skeleton"
```

### Task 10: Command types + facade queue

**Files:**
- Create: `mhockey/src/game/shared/commands.ts`
- Create: `mhockey/src/game/facade/MatchFacade.ts`
- Create: `mhockey/src/game/facade/__tests__/MatchFacade.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { MatchFacade } from '../MatchFacade'

describe('MatchFacade', () => {
  it('queues input and clears after tick', () => {
    const facade = new MatchFacade()
    facade.startMatch({
      periodMs: 1000,
      overtimeMs: 500,
      stuck: { epsilonSpeed: 0.01, thresholdTicks: 3, popStrength: 2 },
      seed: 1,
    })

    facade.sendInput({ type: 'move', playerId: 'p1', dir: { x: 1, y: 0 } })
    expect(facade.getPendingInputCount()).toBe(1)

    facade.tick(16)
    expect(facade.getPendingInputCount()).toBe(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/facade/__tests__/MatchFacade.test.ts`  
Expected: FAIL with "Cannot find module '../MatchFacade'"

**Step 3: Write minimal implementation**

`mhockey/src/game/shared/commands.ts`:

```ts
import type { Vec2 } from './math'

export type Command =
  | { type: 'move'; playerId: string; dir: Vec2 }
  | { type: 'shoot'; playerId: string; target: Vec2 }
  | { type: 'pass'; playerId: string; target: Vec2 }
  | { type: 'lightHit'; playerId: string }
  | { type: 'heavyHit'; playerId: string }
  | { type: 'raceSkill'; playerId: string }
  | { type: 'captainCommand'; playerId: string }
```

`mhockey/src/game/facade/MatchFacade.ts`:

```ts
import { createRng } from '../shared/rng'
import type { Command } from '../shared/commands'
import { createMatchState } from '../sim/state'
import { tickMatch, type MatchConfig } from '../sim/tick'

export type MatchStartConfig = MatchConfig & { seed: number }

export class MatchFacade {
  private state = createMatchState()
  private rng = createRng(1)
  private pending: Command[] = []
  private config: MatchConfig = {
    periodMs: 1000,
    overtimeMs: 500,
    stuck: { epsilonSpeed: 0.01, thresholdTicks: 3, popStrength: 2 },
  }

  startMatch(config: MatchStartConfig): void {
    this.config = config
    this.state = createMatchState()
    this.rng = createRng(config.seed)
    this.pending = []
  }

  sendInput(command: Command): void {
    this.pending.push(command)
  }

  getPendingInputCount(): number {
    return this.pending.length
  }

  tick(dtMs: number): void {
    tickMatch(this.state, dtMs, this.rng, this.config)
    this.pending = []
  }

  getSnapshot() {
    return {
      tick: this.state.tick,
      score: this.state.score,
      period: this.state.clock.period,
      phase: this.state.clock.phase,
    }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/facade/__tests__/MatchFacade.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/shared/commands.ts mhockey/src/game/facade/MatchFacade.ts mhockey/src/game/facade/__tests__/MatchFacade.test.ts
git commit -m "feat: add facade input queue"
```

### Task 11: Scene machine skeleton

**Files:**
- Create: `mhockey/src/game/scenes/Scene.ts`
- Create: `mhockey/src/game/scenes/SceneMachine.ts`
- Create: `mhockey/src/game/scenes/__tests__/SceneMachine.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect, vi } from 'vitest'
import { SceneMachine } from '../SceneMachine'

describe('SceneMachine', () => {
  it('calls exit and enter on transition', () => {
    const enterA = vi.fn()
    const exitA = vi.fn()
    const enterB = vi.fn()

    const sceneA = { id: 'A', enter: enterA, exit: exitA, update: () => {} }
    const sceneB = { id: 'B', enter: enterB, exit: () => {}, update: () => {} }

    const machine = new SceneMachine(sceneA)
    machine.transitionTo(sceneB)

    expect(exitA).toHaveBeenCalled()
    expect(enterB).toHaveBeenCalled()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/scenes/__tests__/SceneMachine.test.ts`  
Expected: FAIL with "Cannot find module '../SceneMachine'"

**Step 3: Write minimal implementation**

`mhockey/src/game/scenes/Scene.ts`:

```ts
export type Scene = {
  id: string
  enter: () => void
  exit: () => void
  update: (dtMs: number) => void
}
```

`mhockey/src/game/scenes/SceneMachine.ts`:

```ts
import type { Scene } from './Scene'

export class SceneMachine {
  private current: Scene

  constructor(initial: Scene) {
    this.current = initial
    this.current.enter()
  }

  transitionTo(next: Scene): void {
    this.current.exit()
    this.current = next
    this.current.enter()
  }

  update(dtMs: number): void {
    this.current.update(dtMs)
  }

  getCurrentId(): string {
    return this.current.id
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/scenes/__tests__/SceneMachine.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/scenes/Scene.ts mhockey/src/game/scenes/SceneMachine.ts mhockey/src/game/scenes/__tests__/SceneMachine.test.ts
git commit -m "feat: add scene machine skeleton"
```

### Task 12: Minimal GameShell integration (manual check)

**Files:**
- Create: `mhockey/src/app/App.tsx`
- Create: `mhockey/src/ui/Scoreboard.tsx`
- Modify: `src/App.tsx`

**Step 1: Implement a minimal GameShell**

`mhockey/src/ui/Scoreboard.tsx`:

```tsx
type ScoreboardProps = {
  home: number
  away: number
  period: number
  phase: string
}

export const Scoreboard = ({ home, away, period, phase }: ScoreboardProps) => {
  return (
    <div>
      <div>Home {home} - Away {away}</div>
      <div>Period {period} ({phase})</div>
    </div>
  )
}
```

`mhockey/src/app/App.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { MatchFacade } from '../game/facade/MatchFacade'
import { Scoreboard } from '../ui/Scoreboard'

export const App = () => {
  const facadeRef = useRef<MatchFacade | null>(null)
  const [snapshot, setSnapshot] = useState({ home: 0, away: 0, period: 1, phase: 'regulation' })

  useEffect(() => {
    const facade = new MatchFacade()
    facade.startMatch({
      periodMs: 10000,
      overtimeMs: 5000,
      stuck: { epsilonSpeed: 0.01, thresholdTicks: 180, popStrength: 2 },
      seed: 1,
    })
    facadeRef.current = facade

    let raf = 0
    const loop = () => {
      facade.tick(16)
      const snap = facade.getSnapshot()
      setSnapshot({ home: snap.score.home, away: snap.score.away, period: snap.period, phase: snap.phase })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div>
      <h1>Monster Hockey</h1>
      <Scoreboard home={snapshot.home} away={snapshot.away} period={snapshot.period} phase={snapshot.phase} />
    </div>
  )
}
```

Update `src/App.tsx`:

```tsx
import { App as GameApp } from '../mhockey/src/app/App'

function App() {
  return <GameApp />
}

export default App
```

**Step 2: Manual verification**

Run: `npm run dev`  
Verify: page loads "Monster Hockey" and scoreboard renders; period increments over time as the clock advances.

**Step 3: Commit**

```bash
git add mhockey/src/app/App.tsx mhockey/src/ui/Scoreboard.tsx src/App.tsx
git commit -m "feat: wire minimal game shell"
```
