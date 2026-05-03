import type { HttpRequest } from '@azure/functions'
import type { ClientPrincipal } from './contracts'

export const mockPrincipal: ClientPrincipal = {
  userId: 'local-user',
  userDetails: 'Mika Everett',
  userRoles: ['authenticated', 'admin'],
  claims: [],
}

export function getClientPrincipal(request: HttpRequest): ClientPrincipal {
  const header = request.headers.get('x-ms-client-principal')

  if (!header) {
    return mockPrincipal
  }

  try {
    const decoded = Buffer.from(header, 'base64').toString('utf-8')
    return JSON.parse(decoded) as ClientPrincipal
  } catch {
    return mockPrincipal
  }
}
