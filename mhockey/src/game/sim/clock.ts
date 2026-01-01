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
