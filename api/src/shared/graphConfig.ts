export type GraphExecutionMode = 'hybrid' | 'live' | 'seeded'

export type GraphConfig = {
  mode: GraphExecutionMode
  tenantId: string | null
  clientId: string | null
  clientSecret: string | null
  newsSiteIds: string[]
  searchEntityTypes: string[]
  cacheTableName: string
}

function parseMode(value: string | undefined): GraphExecutionMode {
  if (value === 'live' || value === 'seeded') {
    return value
  }

  return 'hybrid'
}

function splitCsv(value: string | undefined, fallback: string[]): string[] {
  if (!value) {
    return fallback
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export function getGraphConfig(): GraphConfig {
  return {
    mode: parseMode(process.env.GRAPH_MODE),
    tenantId: process.env.GRAPH_TENANT_ID ?? null,
    clientId: process.env.GRAPH_CLIENT_ID ?? null,
    clientSecret: process.env.GRAPH_CLIENT_SECRET ?? null,
    newsSiteIds: splitCsv(process.env.GRAPH_NEWS_SITE_IDS, []),
    searchEntityTypes: splitCsv(process.env.GRAPH_SEARCH_ENTITY_TYPES, [
      'site',
      'listItem',
      'driveItem',
    ]),
    cacheTableName: process.env.GRAPH_CACHE_TABLE_NAME ?? 'GraphCache',
  }
}

export function hasGraphAppCredentials(config = getGraphConfig()) {
  return Boolean(config.tenantId && config.clientId && config.clientSecret)
}
