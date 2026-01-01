# Monster Hockey Design (v1 Foundations)

## Vision

Single-player browser hockey with a violent, arcade tone. You play continuously as the captain in a contract-driven sandbox. The game favors fast matches, minimal rules, and visible progression. It must scale in scope without rewrites, so the core sim is deterministic and renderer-agnostic.

## Architecture

Use a sim-first core. `src/game/sim` owns authoritative state and rules, runs fixed-timestep ticks, accepts commands, and emits snapshots/events. `src/game/render` consumes snapshots for Pixi visuals with interpolation and camera. `src/game/scenes` manages the state machine (Boot -> MainMenu -> TeamManager -> MatchLobby -> Match -> PostMatch). `src/game/input` maps keyboard/mouse to sim commands. `src/game/facade` exposes a narrow API (`startMatch`, `tick`, `getSnapshot`, `sendInput`). `src/game/shared` holds math, RNG, IDs, and types. React overlays read snapshots/events only.

## Match Rules and Flow

No offsides, icing, or penalties. The puck cannot leave play; rink collision keeps it in. Faceoffs only after goals; otherwise play continues. Three short periods; roster swaps and gear changes happen between periods, no line changes mid-period. Overtime is sudden death, shorter, and spicier via hazards/buffs. Goalie can roam with a tether debuff that scales with distance from the crease. Stuck puck resolver triggers if puck speed < epsilon and possession/region is unchanged for X ticks, applying a deterministic "pop free."

## Combat and Injuries

Combat is part of normal play: light hit, heavy hit, and one race skill. Locked brawls are rare. Brawl resolution is deterministic: roll injury chance (loser biased), then body part, then injury type; the loser is stunned/knocked down. Injuries persist across matches: cuts (1), sprains (2-3), fractures (6+). Low stamina increases injury risk and reduces shot power.

## Player Progression and Gear

Players level up automatically with XP per match. Growth nudges archetypes (Werewolves speed/pressure, Bears strength/goalie, Humans balanced) without hard role locks. XP farming is prevented by action-category diminishing returns: spammy actions (hits/checks/stuns) use 3 full / 3 half / then minimal, while rare actions (goals/assists/saves) do not diminish. Participation and match result XP never diminish.

Gear provides percentage modifiers with two curves: a soft-cap curve per stat (full value to +30%, then discounted excess) and a skill-based curve that scales how much of the effective bonus a player can realize (smooth, no hard ceiling). This prevents extreme stacking and keeps gear useful at all levels.

## Captain and Races

Playable races: Werewolves, Bears, Humans. Roles are flexible, but archetypes guide strengths. The captain has a "Speed Command" team buff, scaling with leadership and flavored by race.

## Meta Loop and Economy

Contracts come from a rotating job board; one week equals a refresh. Risk is a simple weighted sum of opponent strength, match length, and aggression, shown as a short breakdown (e.g., "Long match", "Opponent: Brutal hitters", "Hazards: Volatile"). Cash is the primary currency; fame unlocks higher-tier contracts. Weekly salary and upkeep drain cash. Injuries only gate you if you cannot field 6 players. Roster is unlimited outside matches (limited by upkeep), but only 10 players are available per match.

## Persistence (Supabase)

Use Supabase Auth (email + password) and Postgres. The client loads a profile keyed by user_id, storing only meta progression: cash, fame, week, roster, injuries, gear. Match sim remains local; PostMatch writes deltas. Contracts are generated client-side from a seed and stored in the profile for consistency. RLS limits users to their own records. Offline play queues deltas for later sync.
