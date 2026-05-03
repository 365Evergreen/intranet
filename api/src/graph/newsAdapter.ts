import type { InvocationContext } from '@azure/functions'
import type { NewsArticle } from '../shared/contracts'
import { getOrLoadCache } from '../shared/cacheService'
import { getGraphConfig } from '../shared/graphConfig'
import {
  getAppGraphJson,
  type GraphRequestContext,
  GraphConfigurationError,
} from '../shared/graphClient'
import { logWarning } from '../shared/logger'
import { seededNewsArticles } from '../shared/seedData'

type GraphPage = {
  id: string
  title?: string
  description?: string
  createdDateTime?: string
  lastModifiedDateTime?: string
  promotionKind?: string
}

type GraphPageCollection = {
  value: GraphPage[]
}

function mapNewsArticle(item: GraphPage): NewsArticle {
  return {
    id: item.id,
    title: item.title ?? 'Untitled article',
    summary: item.description ?? 'Read the full update in SharePoint.',
    category: item.promotionKind ?? 'News',
    publishedAt: item.lastModifiedDateTime ?? item.createdDateTime ?? new Date().toISOString(),
  }
}

async function loadGraphNews(
  requestContext: GraphRequestContext,
): Promise<NewsArticle[]> {
  const config = getGraphConfig()
  const siteId = config.newsSiteIds[0]

  if (!siteId) {
    throw new GraphConfigurationError('GRAPH_NEWS_SITE_IDS must include at least one site ID.')
  }

  const response = await getAppGraphJson<GraphPageCollection>(
    requestContext,
    `/sites/${siteId}/pages/microsoft.graph.sitePage?$top=6&$select=id,title,description,createdDateTime,lastModifiedDateTime,promotionKind`,
  )

  return response.value.map(mapNewsArticle)
}

export async function getNewsFeed(
  requestContext: GraphRequestContext,
  context: InvocationContext,
) {
  return getOrLoadCache<NewsArticle[]>({
    context,
    key: `news:${getGraphConfig().newsSiteIds.join(',') || 'seeded'}`,
    ttlSeconds: 600,
    loader: async () => {
      try {
        return {
          source: 'graph',
          value: await loadGraphNews(requestContext),
        } as const
      } catch (error) {
        if (getGraphConfig().mode === 'live') {
          throw error
        }

        logWarning(context, 'Using seeded news content', {
          reason: error instanceof Error ? error.message : 'Unknown error',
        })

        return {
          source: 'seeded',
          value: seededNewsArticles,
        } as const
      }
    },
  })
}
