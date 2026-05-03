import { describe, expect, it } from 'vitest'
import { formatDate } from './formatters'

describe('formatDate', () => {
  it('formats dates using AU locale order', () => {
    expect(formatDate('2026-05-03T00:00:00.000Z')).toContain('May')
  })
})
