import { ClientSecretCredential } from '@azure/identity'
import { randomUUID } from 'node:crypto'
import type { HttpRequest } from '@azure/functions'
import type { ClientPrincipal } from './contracts'
import { getGraphConfig, hasGraphAppCredentials } from './graphConfig'

const GRAPH_SCOPE = 'https://graph.microsoft.com/.default'
const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0'

export type GraphRequestContext = {
  principal: ClientPrincipal
  delegatedAccessToken: string | null
  correlationId: string
  mode: string
}

export class GraphConfigurationError extends Error {}

let appCredential: ClientSecretCredential | null = null

function getCorrelationId(request: HttpRequest) {
  return (
    request.headers.get('x-ms-request-id') ??
    request.headers.get('x-correlation-id') ??
    randomUUID()
  )
}

function getAppCredential() {
  const config = getGraphConfig()

  if (!hasGraphAppCredentials(config)) {
    throw new GraphConfigurationError('Graph app credentials are not fully configured.')
  }

  if (!appCredential) {
    appCredential = new ClientSecretCredential(
      config.tenantId!,
      config.clientId!,
      config.clientSecret!,
    )
  }

  return appCredential
}

async function getAppAccessToken() {
  const token = await getAppCredential().getToken(GRAPH_SCOPE)

  if (!token?.token) {
    throw new GraphConfigurationError('Unable to acquire an app access token for Microsoft Graph.')
  }

  return token.token
}

async function requestGraphJson<T>(
  accessToken: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${GRAPH_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Graph request failed for ${path}: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

export function buildGraphContext(
  request: HttpRequest,
  principal: ClientPrincipal,
): GraphRequestContext {
  const delegatedAccessToken =
    request.headers.get('x-ms-token-aad-access-token') ??
    request.headers.get('x-ms-token-aad-id-token') ??
    null

  return {
    principal,
    delegatedAccessToken,
    correlationId: getCorrelationId(request),
    mode: getGraphConfig().mode,
  }
}

export async function getAppGraphJson<T>(
  _requestContext: GraphRequestContext,
  path: string,
  init?: RequestInit,
) {
  return requestGraphJson<T>(await getAppAccessToken(), path, init)
}

export async function getDelegatedGraphJson<T>(
  requestContext: GraphRequestContext,
  path: string,
  init?: RequestInit,
) {
  if (!requestContext.delegatedAccessToken) {
    throw new GraphConfigurationError('A delegated Graph token was not available on the request.')
  }

  return requestGraphJson<T>(requestContext.delegatedAccessToken, path, init)
}
