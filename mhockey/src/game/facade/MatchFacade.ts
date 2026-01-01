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
