import type { ClientPrincipal } from './contracts'

export function buildGraphContext(principal: ClientPrincipal) {
  return {
    delegated: principal.userRoles.includes('authenticated'),
    user: principal.userDetails,
  }
}
