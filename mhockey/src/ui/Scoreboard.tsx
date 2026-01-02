type ScoreboardProps = {
  home: number
  away: number
  period: number
  phase: 'regulation' | 'overtime' | 'final'
}

export const Scoreboard = ({ home, away, period, phase }: ScoreboardProps) => {
  const meta = (() => {
    if (phase === 'final') {
      return { left: 'Final', right: null as string | null }
    }
    if (phase === 'overtime') {
      return { left: 'OT', right: 'Overtime' }
    }
    return { left: `Period ${period}`, right: 'Regulation' }
  })()

  return (
    <div className="scoreboard">
      <div className="scoreboard-row">
        <span className="scoreboard-label">Home</span>
        <span className="scoreboard-score">{home}</span>
        <span className="scoreboard-divider">-</span>
        <span className="scoreboard-score">{away}</span>
        <span className="scoreboard-label">Away</span>
      </div>
      <div className="scoreboard-meta">
        <span>{meta.left}</span>
        {meta.right ? <span className="scoreboard-phase">{meta.right}</span> : null}
      </div>
    </div>
  )
}
