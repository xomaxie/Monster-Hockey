# Match Layout Modes Design

## Goal

Define layout behavior for Match and Intermission so the Pixi renderer can resize and UI panels adapt based on state.

## Mode + Phase Model

Add layout state attributes on the shell root:

- `data-mode="match"` for match-centric layout
- `data-phase="live" | "intermission" | "goal" | "paused"` for per-phase styling

These attributes drive CSS visibility and layout changes without remounting UI.

## Match Layout

In `data-mode="match"` + `data-phase="live"`:

- Renderer expands to full horizontal width.
- Scoreboard stays centered above the renderer (outside the canvas).
- Match feed becomes a translucent overlay pinned to the top-right of the renderer.
- Roster becomes a horizontal bar above the renderer, showing only 6 on-ice players.
- Job board and non-match panels are hidden.
- Optional full-screen button is shown near the renderer edge.

Roster bar "readable chaos" markers:

- Captain badge (C/crown/skull)
- Possession dot (puck icon when in control)
- KO/stun indicator (temporary ring/blink)
- Name color reflects condition (healthy -> light, minor injury -> amber, severe -> red)

## Intermission Layout

In `data-phase="intermission"`:

- Intermission overlay appears above the renderer for substitutions/gear/condition checks.
- Roster bar expands to show 10 available players.
- Job board stays hidden to avoid distraction.

## Implementation Notes

- Keep the Pixi mount node fixed in DOM; resize canvas based on mode/phase.
- Prefer CSS transitions for panel visibility and roster bar resizing.
- All data needed for UI markers comes from the sim snapshot.
