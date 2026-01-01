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
