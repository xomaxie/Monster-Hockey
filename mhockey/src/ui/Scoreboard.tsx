type ScoreboardProps = {
  home: number
  away: number
  period: number
  phase: string
}

export const Scoreboard = ({ home, away, period, phase }: ScoreboardProps) => {
  return (
    <div>
      <div>
        Home {home} - Away {away}
      </div>
      <div>
        Period {period} ({phase})
      </div>
    </div>
  )
}
