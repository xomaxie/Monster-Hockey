import { useEffect, useRef } from 'react'
import type { Application, Graphics } from 'pixi.js'
import { getRinkLayout } from './rinkLayout'
import { getRinkShapes } from './rinkShapes'

export type ScoreSnapshot = {
  home: number
  away: number
  period: number
  phase: 'regulation' | 'overtime' | 'final'
}

type PixiRendererProps = {
  className?: string
  snapshot: ScoreSnapshot
  hudMessage?: string
}

const formatHudMeta = (snapshot: ScoreSnapshot): string => {
  if (snapshot.phase === 'final') {
    return 'FINAL'
  }
  if (snapshot.phase === 'overtime') {
    return 'OT - OVERTIME'
  }
  return `PERIOD ${snapshot.period} - REGULATION`
}

const drawRink = (graphics: Graphics, width: number, height: number) => {
  const layout = getRinkLayout({ width, height })
  const shapes = getRinkShapes(layout)

  graphics.clear()

  graphics
    .roundRect(layout.bounds.x, layout.bounds.y, layout.bounds.width, layout.bounds.height, layout.bounds.radius)
    .stroke({ width: 3, color: 0xeef1ff, alpha: 0.7 })

  shapes.lines.forEach((line) => {
    const color = line.kind === 'center' ? 0xea3a3a : line.kind === 'blue' ? 0x4758d6 : 0xe0cfc0
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

  shapes.debugMarkers.forEach((marker) => {
    const color = marker.kind === 'captain' ? 0xe1811f : 0xeeeded
    graphics.circle(marker.x, marker.y, marker.radius).stroke({ width: 2, color, alpha: 0.85 })
  })
}

export const PixiRenderer = ({ className, snapshot, hudMessage }: PixiRendererProps) => {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const snapshotRef = useRef<ScoreSnapshot>(snapshot)
  const messageRef = useRef<string>(hudMessage ?? '')
  const updateHudRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    snapshotRef.current = snapshot
    messageRef.current = hudMessage ?? ''
    updateHudRef.current?.()
  }, [snapshot, hudMessage])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let app: Application | null = null
    let resizeObserver: ResizeObserver | null = null
    let resizeHandler: (() => void) | null = null
    let useWindowResize = false

    const boot = async () => {
      const { Application: PixiApplication, Container: PixiContainer, Graphics: PixiGraphics, Text: PixiText } =
        await import('pixi.js')
      if (!hostRef.current) return

      app = new PixiApplication()
      const rinkLayer = new PixiGraphics()
      const debugLayer = new PixiGraphics()
      const hudLayer = new PixiContainer()
      const hudBox = new PixiGraphics()
      const noteBox = new PixiGraphics()
      const scoreText = new PixiText('', {
        fontFamily: 'Rajdhani, Segoe UI, sans-serif',
        fontSize: 18,
        fill: 0xeeeded,
        fontWeight: '600',
      })
      const metaText = new PixiText('', {
        fontFamily: 'Rajdhani, Segoe UI, sans-serif',
        fontSize: 12,
        fill: 0x4758d6,
        fontWeight: '600',
      })
      const noteText = new PixiText('', {
        fontFamily: 'Rajdhani, Segoe UI, sans-serif',
        fontSize: 12,
        fill: 0xc8c4c4,
      })

      await app.init({
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
      })

      if (!hostRef.current) return
      hostRef.current.appendChild(app.canvas)
      app.stage.addChild(rinkLayer)
      app.stage.addChild(debugLayer)
      app.stage.addChild(hudLayer)
      hudLayer.addChild(hudBox)
      hudLayer.addChild(scoreText)
      hudLayer.addChild(metaText)
      hudLayer.addChild(noteBox)
      hudLayer.addChild(noteText)

      const updateHud = () => {
        if (!hostRef.current) return
        const width = hostRef.current.clientWidth
        const height = hostRef.current.clientHeight
        if (width <= 0 || height <= 0) return

        const snapshot = snapshotRef.current
        const message = messageRef.current
        scoreText.text = `HOME ${snapshot.home} - ${snapshot.away} AWAY`
        metaText.text = formatHudMeta(snapshot)
        noteText.text = message

        const paddingX = 14
        const paddingY = 10
        const gap = 4
        const boxWidth = Math.max(scoreText.width, metaText.width) + paddingX * 2
        const boxHeight = paddingY * 2 + scoreText.height + gap + metaText.height
        const boxX = width / 2 - boxWidth / 2
        const boxY = 12

        hudBox.clear()
        hudBox.roundRect(boxX, boxY, boxWidth, boxHeight, 12).fill({ color: 0x191515, alpha: 0.75 })
        hudBox.roundRect(boxX, boxY, boxWidth, boxHeight, 12).stroke({ width: 1, color: 0x3a3232, alpha: 0.9 })

        scoreText.position.set(width / 2 - scoreText.width / 2, boxY + paddingY)
        metaText.position.set(width / 2 - metaText.width / 2, boxY + paddingY + scoreText.height + gap)

        if (message) {
          const notePaddingX = 12
          const notePaddingY = 6
          const noteWidth = noteText.width + notePaddingX * 2
          const noteHeight = noteText.height + notePaddingY * 2
          const noteX = width / 2 - noteWidth / 2
          const noteY = boxY + boxHeight + 8
          noteBox.visible = true
          noteText.visible = true
          noteBox.clear()
          noteBox.roundRect(noteX, noteY, noteWidth, noteHeight, 999).fill({ color: 0x191515, alpha: 0.7 })
          noteBox.roundRect(noteX, noteY, noteWidth, noteHeight, 999).stroke({ width: 1, color: 0x3a3232, alpha: 0.8 })
          noteText.position.set(width / 2 - noteText.width / 2, noteY + notePaddingY)
        } else {
          noteBox.visible = false
          noteText.visible = false
        }
      }

      const resize = () => {
        const width = hostRef.current?.clientWidth ?? 0
        const height = hostRef.current?.clientHeight ?? 0
        if (width <= 0 || height <= 0) return
        app?.renderer.resize(width, height)
        drawRink(rinkLayer, width, height)
        drawDebug(debugLayer, width, height)
        updateHud()
      }
      resizeHandler = resize
      updateHudRef.current = updateHud

      resize()
      if (typeof ResizeObserver === 'undefined') {
        useWindowResize = true
        window.addEventListener('resize', resize)
      } else {
        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(hostRef.current)
      }
    }

    void boot().catch((error) => {
      console.error('Pixi renderer failed to initialize.', error)
    })

    return () => {
      updateHudRef.current = null
      resizeObserver?.disconnect()
      if (useWindowResize) {
        if (resizeHandler) {
          window.removeEventListener('resize', resizeHandler)
        }
      }
      app?.destroy(true, { children: true })
      if (hostRef.current && app?.canvas.parentNode === hostRef.current) {
        hostRef.current.removeChild(app.canvas)
      }
    }
  }, [])

  return <div ref={hostRef} className={className} />
}
