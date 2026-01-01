export type LayoutMode = 'shell' | 'match'
export type LayoutPhase = 'live' | 'intermission' | 'goal' | 'paused'

export const getLayoutData = (mode: LayoutMode, phase: LayoutPhase) => ({
  'data-mode': mode,
  'data-phase': phase,
})
