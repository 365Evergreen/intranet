import { describe, expect, it } from 'vitest'
import { getGraphConfig } from './graphConfig'

describe('getGraphConfig', () => {
  it('defaults to hybrid graph mode', () => {
    delete process.env.GRAPH_MODE

    expect(getGraphConfig().mode).toBe('hybrid')
  })
})
