type ScoreboardProps = {
  home: number
  away: number
  period: number
  phase: string
}

export const Scoreboard = ({ home, away, period, phase }: ScoreboardProps) => {
  return (
    <div className="scoreboard">
      <div className="scoreboard-row">
        <span className="scoreboard-label">Home</span>
        <span className="scoreboard-score">{home}</span>
        <span className="scoreboard-divider">—</span>
        <span className="scoreboard-score">{away}</span>
        <span className="scoreboard-label">Away</span>
      </div>
      <div className="scoreboard-meta">
        <span>Period {period}</span>
        <span className="scoreboard-phase">{phase}</span>
      </div>
    </div>
  )
}
