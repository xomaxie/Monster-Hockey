import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { PixiRenderer } from '../PixiRenderer'

describe('PixiRenderer', () => {
  it('renders a host element with className', () => {
    const html = renderToStaticMarkup(
      <PixiRenderer className="mh-pixi-root" snapshot={{ home: 0, away: 0, period: 1, phase: 'regulation' }} />,
    )
    expect(html).toContain('mh-pixi-root')
  })
})
