# Pixi Renderer Scaffold Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mount a Pixi renderer inside the match stage, draw a top‑down rink, and add basic debug shapes (puck + player dots).

**Architecture:** Keep Pixi setup in `mhockey/src/game/render` with pure layout/shape helpers (tested) and a React `PixiRenderer` component that owns the Pixi application, resizes with the host container, and draws the rink each resize.

**Tech Stack:** TypeScript, React, Pixi.js, Vitest.

### Task 1: Rink layout helper

**Files:**
- Create: `mhockey/src/game/render/rinkLayout.ts`
- Create: `mhockey/src/game/render/__tests__/rinkLayout.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { getRinkLayout } from '../rinkLayout'

describe('getRinkLayout', () => {
  it('derives rink bounds and lines from container size', () => {
    const layout = getRinkLayout({ width: 1000, height: 600 })

    expect(layout.bounds.x).toBeCloseTo(36)
    expect(layout.bounds.y).toBeCloseTo(36)
    expect(layout.bounds.width).toBeCloseTo(928)
    expect(layout.bounds.height).toBeCloseTo(528)
    expect(layout.centerLineX).toBeCloseTo(500)
    expect(layout.blueLineXs[0]).toBeCloseTo(342.24)
    expect(layout.blueLineXs[1]).toBeCloseTo(657.76)
    expect(layout.faceoffCircles).toHaveLength(4)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/render/__tests__/rinkLayout.test.ts`  
Expected: FAIL with "Cannot find module '../rinkLayout'"

**Step 3: Write minimal implementation**

```ts
export type Size = { width: number; height: number }

export type RinkLayout = {
  bounds: { x: number; y: number; width: number; height: number; radius: number }
  centerLineX: number
  blueLineXs: [number, number]
  goalLineXs: [number, number]
  faceoffCircles: { x: number; y: number; radius: number }[]
}

export const getRinkLayout = ({ width, height }: Size): RinkLayout => {
  const margin = Math.max(24, Math.min(width, height) * 0.06)
  const rinkWidth = width - margin * 2
  const rinkHeight = height - margin * 2
  const x = margin
  const y = margin
  const radius = Math.min(60, rinkHeight * 0.18)

  const centerLineX = x + rinkWidth / 2
  const blueLineXs: [number, number] = [x + rinkWidth * 0.33, x + rinkWidth * 0.67]
  const goalLineXs: [number, number] = [x + rinkWidth * 0.08, x + rinkWidth * 0.92]
  const faceoffRadius = rinkHeight * 0.11

  const faceoffCircles = [
    { x: x + rinkWidth * 0.25, y: y + rinkHeight * 0.25, radius: faceoffRadius },
    { x: x + rinkWidth * 0.75, y: y + rinkHeight * 0.25, radius: faceoffRadius },
    { x: x + rinkWidth * 0.25, y: y + rinkHeight * 0.75, radius: faceoffRadius },
    { x: x + rinkWidth * 0.75, y: y + rinkHeight * 0.75, radius: faceoffRadius },
  ]

  return {
    bounds: { x, y, width: rinkWidth, height: rinkHeight, radius },
    centerLineX,
    blueLineXs,
    goalLineXs,
    faceoffCircles,
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/render/__tests__/rinkLayout.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/render/rinkLayout.ts mhockey/src/game/render/__tests__/rinkLayout.test.ts
git commit -m "feat: add rink layout helper"
```

### Task 2: Rink shapes helper (lines, circles, debug entities)

**Files:**
- Create: `mhockey/src/game/render/rinkShapes.ts`
- Create: `mhockey/src/game/render/__tests__/rinkShapes.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { getRinkLayout } from '../rinkLayout'
import { getRinkShapes } from '../rinkShapes'

describe('getRinkShapes', () => {
  it('returns lines, circles, and debug entities', () => {
    const layout = getRinkLayout({ width: 1000, height: 600 })
    const shapes = getRinkShapes(layout)

    expect(shapes.lines).toHaveLength(5)
    expect(shapes.faceoffCircles).toHaveLength(4)
    expect(shapes.debugPlayers).toHaveLength(6)
    expect(shapes.debugPuck).toEqual({ x: layout.centerLineX, y: 300 })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/render/__tests__/rinkShapes.test.ts`  
Expected: FAIL with "Cannot find module '../rinkShapes'"

**Step 3: Write minimal implementation**

```ts
import type { RinkLayout } from './rinkLayout'

export type Line = { x1: number; y1: number; x2: number; y2: number; kind: 'center' | 'blue' | 'goal' }
export type Circle = { x: number; y: number; radius: number; kind: 'faceoff' }
export type DebugDot = { x: number; y: number; radius: number; kind: 'puck' | 'home' | 'away' }

export type RinkShapes = {
  lines: Line[]
  faceoffCircles: Circle[]
  debugPlayers: DebugDot[]
  debugPuck: { x: number; y: number }
}

export const getRinkShapes = (layout: RinkLayout): RinkShapes => {
  const { bounds, centerLineX, blueLineXs, goalLineXs, faceoffCircles } = layout
  const midY = bounds.y + bounds.height / 2

  const lines: Line[] = [
    { x1: centerLineX, y1: bounds.y, x2: centerLineX, y2: bounds.y + bounds.height, kind: 'center' },
    { x1: blueLineXs[0], y1: bounds.y, x2: blueLineXs[0], y2: bounds.y + bounds.height, kind: 'blue' },
    { x1: blueLineXs[1], y1: bounds.y, x2: blueLineXs[1], y2: bounds.y + bounds.height, kind: 'blue' },
    { x1: goalLineXs[0], y1: bounds.y, x2: goalLineXs[0], y2: bounds.y + bounds.height, kind: 'goal' },
    { x1: goalLineXs[1], y1: bounds.y, x2: goalLineXs[1], y2: bounds.y + bounds.height, kind: 'goal' },
  ]

  const debugPuck = { x: centerLineX, y: midY }

  const debugPlayers: DebugDot[] = [
    { x: centerLineX - bounds.width * 0.18, y: midY - bounds.height * 0.18, radius: 10, kind: 'home' },
    { x: centerLineX - bounds.width * 0.18, y: midY + bounds.height * 0.18, radius: 10, kind: 'home' },
    { x: centerLineX - bounds.width * 0.32, y: midY, radius: 10, kind: 'home' },
    { x: centerLineX + bounds.width * 0.18, y: midY - bounds.height * 0.18, radius: 10, kind: 'away' },
    { x: centerLineX + bounds.width * 0.18, y: midY + bounds.height * 0.18, radius: 10, kind: 'away' },
    { x: centerLineX + bounds.width * 0.32, y: midY, radius: 10, kind: 'away' },
  ]

  return {
    lines,
    faceoffCircles: faceoffCircles.map((circle) => ({ ...circle, kind: 'faceoff' })),
    debugPlayers,
    debugPuck,
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/render/__tests__/rinkShapes.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/render/rinkShapes.ts mhockey/src/game/render/__tests__/rinkShapes.test.ts
git commit -m "feat: add rink shape descriptors"
```

### Task 3: Pixi renderer component

**Files:**
- Create: `mhockey/src/game/render/PixiRenderer.tsx`
- Create: `mhockey/src/game/render/__tests__/PixiRenderer.test.tsx`

**Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { PixiRenderer } from '../PixiRenderer'

describe('PixiRenderer', () => {
  it('renders a host element with className', () => {
    const html = renderToStaticMarkup(<PixiRenderer className="mh-pixi-root" />)
    expect(html).toContain('mh-pixi-root')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/game/render/__tests__/PixiRenderer.test.tsx`  
Expected: FAIL with "Cannot find module '../PixiRenderer'"

**Step 3: Write minimal implementation**

```tsx
import { useEffect, useRef } from 'react'
import { Application, Graphics } from 'pixi.js'
import { getRinkLayout } from './rinkLayout'
import { getRinkShapes } from './rinkShapes'

type PixiRendererProps = {
  className?: string
}

const drawRink = (graphics: Graphics, width: number, height: number) => {
  const layout = getRinkLayout({ width, height })
  const shapes = getRinkShapes(layout)

  graphics.clear()

  graphics.roundRect(
    layout.bounds.x,
    layout.bounds.y,
    layout.bounds.width,
    layout.bounds.height,
    layout.bounds.radius
  ).stroke({ width: 3, color: 0xeef1ff, alpha: 0.7 })

  shapes.lines.forEach((line) => {
    const color =
      line.kind === 'center' ? 0xea3a3a : line.kind === 'blue' ? 0x4758d6 : 0xe0cfc0
    graphics.moveTo(line.x1, line.y1).lineTo(line.x2, line.y2).stroke({ width: 2, color, alpha: 0.8 })
  })

  shapes.faceoffCircles.forEach((circle) => {
    graphics.circle(circle.x, circle.y, circle.radius).stroke({ width: 2, color: 0xe0cfc0, alpha: 0.7 })
  })
}

const drawDebug = (graphics: Graphics, width: number, height: number) => {
  const layout = getRinkLayout({ width, height })
  const shapes = getRinkShapes(layout)

  graphics.clear()

  shapes.debugPlayers.forEach((dot) => {
    const color = dot.kind === 'home' ? 0xe1811f : 0x4758d6
    graphics.circle(dot.x, dot.y, dot.radius).fill({ color, alpha: 0.9 })
  })

  graphics.circle(shapes.debugPuck.x, shapes.debugPuck.y, 6).fill({ color: 0xeeeded, alpha: 0.9 })
}

export const PixiRenderer = ({ className }: PixiRendererProps) => {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const app = new Application()
    let resizeObserver: ResizeObserver | null = null
    const rinkLayer = new Graphics()
    const debugLayer = new Graphics()

    const boot = async () => {
      await app.init({
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
      })

      if (!hostRef.current) return
      hostRef.current.appendChild(app.canvas)
      app.stage.addChild(rinkLayer)
      app.stage.addChild(debugLayer)

      const resize = () => {
        const width = hostRef.current?.clientWidth ?? 0
        const height = hostRef.current?.clientHeight ?? 0
        if (width <= 0 || height <= 0) return
        app.renderer.resize(width, height)
        drawRink(rinkLayer, width, height)
        drawDebug(debugLayer, width, height)
      }

      resize()
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(hostRef.current)
    }

    void boot()

    return () => {
      resizeObserver?.disconnect()
      app.destroy(true, { children: true })
      if (hostRef.current && app.canvas.parentNode === hostRef.current) {
        hostRef.current.removeChild(app.canvas)
      }
    }
  }, [])

  return <div ref={hostRef} className={className} />
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/game/render/__tests__/PixiRenderer.test.tsx`  
Expected: PASS

**Step 5: Commit**

```bash
git add mhockey/src/game/render/PixiRenderer.tsx mhockey/src/game/render/__tests__/PixiRenderer.test.tsx
git commit -m "feat: add pixi renderer scaffold"
```

### Task 4: App integration + Pixi styles

**Files:**
- Modify: `mhockey/src/app/App.tsx`
- Modify: `mhockey/src/app/__tests__/AppLayout.test.tsx`
- Modify: `src/App.css`

**Step 1: Write the failing test**

Update `mhockey/src/app/__tests__/AppLayout.test.tsx`:

```ts
expect(html).toContain('mh-pixi-root')
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- mhockey/src/app/__tests__/AppLayout.test.tsx`  
Expected: FAIL with missing `mh-pixi-root`

**Step 3: Implement integration**

In `mhockey/src/app/App.tsx`, import and place the Pixi renderer:

```tsx
import { PixiRenderer } from '../game/render/PixiRenderer'

<div className="mh-stage-canvas">
  <PixiRenderer className="mh-pixi-root" />
  ...
</div>
```

In `src/App.css`, add:

```css
.mh-pixi-root {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.mh-pixi-root canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.mh-scoreboard-overlay,
.mh-feed-overlay {
  z-index: 2;
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- mhockey/src/app/__tests__/AppLayout.test.tsx`  
Expected: PASS

**Step 5: Manual verification**

Run: `npm run dev`  
Verify: Pixi canvas fills the renderer area and shows rink lines and debug dots.

**Step 6: Commit**

```bash
git add mhockey/src/app/App.tsx mhockey/src/app/__tests__/AppLayout.test.tsx src/App.css
git commit -m "feat: mount pixi renderer in match stage"
```
