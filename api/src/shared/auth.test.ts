import { describe, expect, it } from 'vitest'
import { getClientPrincipal } from './auth'

describe('getClientPrincipal', () => {
  it('falls back to the local mock principal when the header is missing', () => {
    const principal = getClientPrincipal({
      headers: new Headers(),
    } as never)

    expect(principal.userRoles).toContain('admin')
  })
})
