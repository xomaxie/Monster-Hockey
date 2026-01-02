import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { App } from '../App'

describe('App match layout', () => {
  it('sets data-mode and data-phase on the shell', () => {
    const html = renderToStaticMarkup(<App />)
    expect(html).toContain('data-mode="match"')
    expect(html).toContain('data-phase="live"')
  })

  it('includes match roster bar and renderer host', () => {
    const html = renderToStaticMarkup(<App />)
    expect(html).toContain('mh-roster-bar')
    expect(html).toContain('mh-pixi-root')
  })
})
