# Match Layout UI Hooks Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add data-mode/data-phase layout hooks and match-focused UI scaffolding (roster bar, feed overlay, intermission overlay) while keeping the Pixi mount node fixed.

**Architecture:** A small layout helper provides data attributes for the shell. React markup adds match-mode placeholders, and CSS uses `data-mode`/`data-phase` selectors to hide panels and reposition UI for Match vs Intermission.

**Tech Stack:** TypeScript, React, Vite, CSS.

### Task 1: Layout mode helper (data attributes)

**Files:**
- Create: `mhockey/src/app/layout.ts`
- Create: `mhockey/src/app/__tests__/layout.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { getLayoutData } from '../layout'

describe('layout data', () => {
  it('returns data-mode and data-phase attributes', () => {
    expect(getLayoutData('match', 'live')).toEqual({ 'data-mode': 'match', 'data-phase': 'live' })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/app/__tests__/layout.test.ts`  
Expected: FAIL with "Cannot find module '../layout'"

**Step 3: Write minimal implementation**

```ts
export type LayoutMode = 'shell' | 'match'
export type LayoutPhase = 'live' | 'intermission' | 'goal' | 'paused'

export const getLayoutData = (mode: LayoutMode, phase: LayoutPhase) => ({
  'data-mode': mode,
  'data-phase': phase,
})
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/app/__tests__/layout.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/app/layout.ts mhockey/src/app/__tests__/layout.test.ts
git commit -m "feat: add layout data helper"
```

### Task 2: Match layout scaffolding in App

**Files:**
- Modify: `mhockey/src/app/App.tsx`

**Step 1: Write the failing test**

Create a small layout snapshot helper test to lock data attributes:

```ts
import { describe, it, expect } from 'vitest'
import { getLayoutData } from '../layout'

describe('match layout uses data attributes', () => {
  it('uses match/live by default', () => {
    const data = getLayoutData('match', 'live')
    expect(data['data-mode']).toBe('match')
    expect(data['data-phase']).toBe('live')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/app/__tests__/layout.test.ts`  
Expected: FAIL (if not already passing) or skip if already green from Task 1

**Step 3: Update App layout**

Add layout state and data attributes on `.mh-shell`:

```tsx
import { getLayoutData, type LayoutMode, type LayoutPhase } from './layout'

const mode: LayoutMode = 'match'
const phase: LayoutPhase = 'live'
const layoutData = getLayoutData(mode, phase)

return (
  <div className="mh-shell" {...layoutData}>
    ...
  </div>
)
```

Add match roster bar and overlays (placeholders only):

- Horizontal roster bar above the renderer (6 players)
- Match feed overlay anchored top-right inside `.mh-stage-canvas`
- Full-screen button placeholder
- Intermission overlay container inside `.mh-stage` (hidden by CSS unless `data-phase="intermission"`)

**Step 4: Manual verification**

Run: `npm run dev`  
Verify: roster bar appears above renderer, feed overlay appears on canvas, full-screen button visible, and no layout collapse.

**Step 5: Commit**

```bash
git add mhockey/src/app/App.tsx
git commit -m "feat: add match layout scaffolding"
```

### Task 3: CSS layout switches for match/intermission

**Files:**
- Modify: `src/App.css`

**Step 1: Write the failing test**

CSS-only change; skip test. (No existing CSS test harness.)

**Step 2: Implement match layout styles**

Add selectors:

- `[data-mode="match"] .mh-main { grid-template-columns: 1fr; }`
- Hide `.mh-panel-left` and `.mh-panel-right` in match mode
- Style `.mh-roster-bar` as a horizontal list with condition colors and markers
- Style `.mh-feed-overlay` as translucent top-right overlay
- Style `.mh-fullscreen` button in the stage header or canvas
- `[data-phase="intermission"] .mh-intermission` visible overlay, otherwise hidden

**Step 3: Manual verification**

Run: `npm run dev`  
Verify: panels hide in match mode, canvas spans full width, overlays sit correctly, intermission overlay only appears when `data-phase="intermission"`.

**Step 4: Commit**

```bash
git add src/App.css
git commit -m "style: add match layout mode styles"
```
