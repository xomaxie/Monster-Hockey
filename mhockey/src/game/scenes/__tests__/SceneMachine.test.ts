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
