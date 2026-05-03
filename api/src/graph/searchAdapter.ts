import type { InvocationContext } from '@azure/functions'
import { randomUUID } from 'node:crypto'
import type { SearchResult } from '../shared/contracts'
import { getOrLoadCache } from '../shared/cacheService'
import { getGraphConfig } from '../shared/graphConfig'
import {
  getAppGraphJson,
  type GraphRequestContext,
} from '../shared/graphClient'
import { logWarning } from '../shared/logger'
import { seededSearchResults } from '../shared/seedData'

type SearchHit = {
  hitId?: string
  summary?: string
  resource?: {
    id?: string
    name?: string
    webUrl?: string
    '@odata.type'?: string
  }
}

type SearchContainer = {
  hitsContainers?: Array<{
    hits?: SearchHit[]
  }>
}

type GraphSearchResponse = {
  value: SearchContainer[]
}

function mapSearchHit(hit: SearchHit): SearchResult {
  return {
    id: hit.hitId ?? hit.resource?.id ?? randomUUID(),
    title: hit.resource?.name ?? 'Search result',
    kind: hit.resource?.['@odata.type']?.split('.').at(-1) ?? 'Result',
    summary: hit.summary ?? 'Open this result in Microsoft 365.',
    url: hit.resource?.webUrl ?? '/search',
  }
}

function filterSeededResults(query: string) {
  if (!query.trim()) {
    return seededSearchResults
  }

  const loweredQuery = query.toLowerCase()
  return seededSearchResults.filter(
    (result) =>
      result.title.toLowerCase().includes(loweredQuery) ||
      result.summary.toLowerCase().includes(loweredQuery),
  )
}

async function loadGraphSearch(
  requestContext: GraphRequestContext,
  query: string,
): Promise<SearchResult[]> {
  const config = getGraphConfig()
  const response = await getAppGraphJson<GraphSearchResponse>(
    requestContext,
    '/search/query',
    {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            entityTypes: config.searchEntityTypes,
            query: {
              queryString: query || 'Evergreen intranet',
            },
            from: 0,
            size: query ? 5 : 3,
          },
        ],
      }),
    },
  )

  return (
    response.value
      .flatMap((container) => container.hitsContainers ?? [])
      .flatMap((container) => container.hits ?? [])
      .map(mapSearchHit)
      .slice(0, query ? 5 : 3)
  )
}

export async function searchIntranet(
  requestContext: GraphRequestContext,
  context: InvocationContext,
  query: string,
) {
  return getOrLoadCache<SearchResult[]>({
    context,
    key: `search:${requestContext.principal.userId}:${query.trim().toLowerCase() || 'default'}`,
    ttlSeconds: query.trim() ? 45 : 300,
    loader: async () => {
      try {
        return {
          source: 'graph',
          value: await loadGraphSearch(requestContext, query),
        } as const
      } catch (error) {
        if (getGraphConfig().mode === 'live') {
          throw error
        }

        logWarning(context, 'Using seeded search results', {
          reason: error instanceof Error ? error.message : 'Unknown error',
          query,
        })

        return {
          source: 'seeded',
          value: filterSeededResults(query),
        } as const
      }
    },
  })
}
