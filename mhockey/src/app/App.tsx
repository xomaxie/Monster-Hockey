import { useEffect, useRef, useState } from 'react'
import { MatchFacade } from '../game/facade/MatchFacade'
import { Scoreboard } from '../ui/Scoreboard'
import { getLayoutData, type LayoutMode, type LayoutPhase } from './layout'

export const App = () => {
  const facadeRef = useRef<MatchFacade | null>(null)
  const [snapshot, setSnapshot] = useState({
    home: 0,
    away: 0,
    period: 1,
    phase: 'regulation',
  })

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

  const mode: LayoutMode = 'match'
  const phase: LayoutPhase = 'live'
  const layoutData = getLayoutData(mode, phase)

  return (
    <div className="mh-shell" {...layoutData}>
      <header className="mh-header">
        <div className="mh-brand">
          <div className="mh-title">Monster Hockey</div>
          <div className="mh-subtitle">Captain&apos;s Console</div>
        </div>
        <div className="mh-header-actions">
          <button type="button">Contracts</button>
          <button type="button" className="mh-button-ghost">
            Settings
          </button>
        </div>
      </header>

      <main className="mh-main">
        <aside className="mh-panel mh-panel-left">
          <div className="mh-panel-title">Roster</div>
          <div className="mh-panel-subtitle">Active 10</div>
          <ul className="mh-list">
            <li>
              <span className="mh-name">Rogue Howl</span>
              <span className="mh-tag">Wolf</span>
              <span className="mh-muted">Winger</span>
            </li>
            <li>
              <span className="mh-name">Ironclaw</span>
              <span className="mh-tag">Bear</span>
              <span className="mh-muted">Goalie</span>
            </li>
            <li>
              <span className="mh-name">Jax Holt</span>
              <span className="mh-tag">Human</span>
              <span className="mh-muted">Center</span>
            </li>
            <li>
              <span className="mh-name">Feral Knit</span>
              <span className="mh-tag">Wolf</span>
              <span className="mh-muted">Defense</span>
            </li>
            <li>
              <span className="mh-name">Mara Vex</span>
              <span className="mh-tag">Human</span>
              <span className="mh-muted">Winger</span>
            </li>
          </ul>
          <div className="mh-panel-divider" />
          <div className="mh-panel-title">Injuries</div>
          <ul className="mh-list mh-list-compact">
            <li>
              <span className="mh-name">Grim Jaw</span>
              <span className="mh-muted">Sprain (2 matches)</span>
            </li>
          </ul>
        </aside>

        <section className="mh-stage">
          <div className="mh-roster-bar">
            <div className="mh-roster-player mh-condition-ok">
              <span className="mh-roster-name">Rogue Howl</span>
              <span className="mh-roster-icons">
                <span className="mh-badge">C</span>
                <span className="mh-possession-dot" />
              </span>
            </div>
            <div className="mh-roster-player mh-condition-warn">
              <span className="mh-roster-name">Jax Holt</span>
              <span className="mh-roster-icons">
                <span className="mh-ko-indicator" />
              </span>
            </div>
            <div className="mh-roster-player mh-condition-ok">
              <span className="mh-roster-name">Feral Knit</span>
            </div>
            <div className="mh-roster-player mh-condition-danger">
              <span className="mh-roster-name">Ironclaw</span>
            </div>
            <div className="mh-roster-player mh-condition-ok">
              <span className="mh-roster-name">Mara Vex</span>
            </div>
            <div className="mh-roster-player mh-condition-ok">
              <span className="mh-roster-name">Vox Hale</span>
            </div>
          </div>
          <div className="mh-stage-header">
            <div>
              <div className="mh-stage-title">Frostbite Arena</div>
              <div className="mh-muted">Contract: High Risk • Long Match</div>
            </div>
            <div className="mh-stage-hazards">
              <span className="mh-pill">Hazards: Volatile</span>
              <span className="mh-pill mh-pill-danger">Overtime Buffs</span>
              <button type="button" className="mh-fullscreen">
                Full Screen
              </button>
            </div>
          </div>
          <div className="mh-stage-canvas">
            <div className="mh-scoreboard-overlay">
              <Scoreboard home={snapshot.home} away={snapshot.away} period={snapshot.period} phase={snapshot.phase} />
            </div>
            <div className="mh-feed-overlay">
              <div className="mh-feed-title">Match Feed</div>
              <ul className="mh-feed">
                <li>
                  <span className="mh-feed-time">00:18</span>
                  <span>Wolf squad pins the puck on the wall.</span>
                </li>
                <li>
                  <span className="mh-feed-time">00:25</span>
                  <span>Heavy hit lands. Stagger chance up.</span>
                </li>
                <li>
                  <span className="mh-feed-time">00:33</span>
                  <span>Captain howl boosts speed.</span>
                </li>
              </ul>
            </div>
            <div className="mh-stage-placeholder">Pixi Renderer</div>
          </div>
          <div className="mh-stage-footer">
            <div className="mh-muted">WASD + Mouse • Q/E for hits • Captain command ready</div>
          </div>
          <div className="mh-intermission">
            <div className="mh-intermission-card">
              <div className="mh-panel-title">Intermission</div>
              <div className="mh-muted">Swap players, adjust gear, review injuries.</div>
              <div className="mh-intermission-actions">
                <button type="button">Sub In Player</button>
                <button type="button" className="mh-button-ghost">
                  Gear Loadout
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="mh-panel mh-panel-right">
          <div className="mh-panel-title">Match Feed</div>
          <ul className="mh-feed">
            <li>
              <span className="mh-feed-time">00:18</span>
              <span>Wolf squad pins the puck on the wall.</span>
            </li>
            <li>
              <span className="mh-feed-time">00:25</span>
              <span>Heavy hit lands. Stagger chance up.</span>
            </li>
            <li>
              <span className="mh-feed-time">00:33</span>
              <span>Captain howl boosts speed.</span>
            </li>
          </ul>
          <div className="mh-panel-divider" />
          <div className="mh-panel-title">Job Board</div>
          <ul className="mh-list mh-list-compact">
            <li>
              <span className="mh-name">Steel City Bruisers</span>
              <span className="mh-muted">Risk: High</span>
            </li>
            <li>
              <span className="mh-name">Red Ice Nomads</span>
              <span className="mh-muted">Risk: Medium</span>
            </li>
          </ul>
        </aside>
      </main>
    </div>
  )
}
