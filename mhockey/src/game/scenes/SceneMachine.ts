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
