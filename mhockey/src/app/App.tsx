import { useEffect, useRef, useState } from 'react'
import { MatchFacade } from '../game/facade/MatchFacade'
import { Scoreboard } from '../ui/Scoreboard'

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

  return (
    <div>
      <h1>Monster Hockey</h1>
      <Scoreboard home={snapshot.home} away={snapshot.away} period={snapshot.period} phase={snapshot.phase} />
    </div>
  )
}
