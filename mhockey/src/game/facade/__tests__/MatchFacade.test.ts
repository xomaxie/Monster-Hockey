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
