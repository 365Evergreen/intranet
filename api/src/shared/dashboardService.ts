import type { InvocationContext } from '@azure/functions'
import type { DashboardSummary, SearchResult } from './contracts'
import { getNavigation } from './dataStore'
import { getRecentFiles } from '../graph/filesAdapter'
import { getNewsFeed } from '../graph/newsAdapter'
import { searchIntranet } from '../graph/searchAdapter'
import type { GraphRequestContext } from './graphClient'
import { seededDashboardUpdates } from './seedData'

function createSuggestions(results: SearchResult[]) {
  return results.slice(0, 3)
}

export async function buildDashboardSummary(
  requestContext: GraphRequestContext,
  context: InvocationContext,
): Promise<DashboardSummary> {
  const [news, files, suggestions] = await Promise.all([
    getNewsFeed(requestContext, context),
    getRecentFiles(requestContext, context),
    searchIntranet(requestContext, context, ''),
  ])

  return {
    welcome:
      'Your intranet is using a cache-first Graph retrieval layer, with fast responses backed by Azure Functions.',
    highlights: [
      {
        label: 'News stories',
        value: String(news.value.length),
        trend: news.source === 'graph' ? 'Live Graph data' : 'Seeded fallback',
      },
      {
        label: 'Recent files',
        value: String(files.value.length),
        trend: files.source === 'graph' ? 'Live Graph data' : 'Seeded fallback',
      },
      {
        label: 'Search suggestions',
        value: String(suggestions.value.length),
        trend:
          suggestions.source === 'graph' ? 'Cached search results' : 'Seeded suggestions',
      },
    ],
    quickLinks: getNavigation().slice(0, 4),
    updates: seededDashboardUpdates,
    news: news.value.slice(0, 3),
    files: files.value.slice(0, 3),
    suggestions: createSuggestions(suggestions.value),
    contentStatus: {
      news: {
        source: news.source,
        cacheLayer: news.cacheLayer,
        cachedAt: news.cachedAt,
        expiresAt: news.expiresAt,
        isStale: news.isStale,
      },
      files: {
        source: files.source,
        cacheLayer: files.cacheLayer,
        cachedAt: files.cachedAt,
        expiresAt: files.expiresAt,
        isStale: files.isStale,
      },
      search: {
        source: suggestions.source,
        cacheLayer: suggestions.cacheLayer,
        cachedAt: suggestions.cachedAt,
        expiresAt: suggestions.expiresAt,
        isStale: suggestions.isStale,
      },
    },
  }
}
