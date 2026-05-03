import type { InvocationContext } from '@azure/functions'
import type { FileItem } from '../shared/contracts'
import { getOrLoadCache } from '../shared/cacheService'
import { getGraphConfig } from '../shared/graphConfig'
import {
  getDelegatedGraphJson,
  GraphConfigurationError,
  type GraphRequestContext,
} from '../shared/graphClient'
import { logWarning } from '../shared/logger'
import { seededRecentFiles } from '../shared/seedData'

type RecentDriveItem = {
  id: string
  name: string
  lastModifiedDateTime?: string
  webUrl?: string
  remoteItem?: {
    file?: Record<string, unknown>
    folder?: Record<string, unknown>
    parentReference?: {
      path?: string
    }
  }
}

type RecentDriveCollection = {
  value: RecentDriveItem[]
}

function mapRecentFile(item: RecentDriveItem): FileItem {
  const location = item.remoteItem?.parentReference?.path?.split(':').at(-1) ?? 'Microsoft 365'

  return {
    id: item.id,
    name: item.name,
    location,
    type: item.remoteItem?.folder ? 'Folder' : 'File',
    updatedAt: item.lastModifiedDateTime ?? new Date().toISOString(),
    url: item.webUrl ?? '#',
  }
}

async function loadGraphFiles(requestContext: GraphRequestContext) {
  if (!requestContext.delegatedAccessToken) {
    throw new GraphConfigurationError(
      'A delegated Graph access token is required for /me/drive/recent.',
    )
  }

  const response = await getDelegatedGraphJson<RecentDriveCollection>(
    requestContext,
    '/me/drive/recent',
  )

  return response.value.map(mapRecentFile)
}

export async function getRecentFiles(
  requestContext: GraphRequestContext,
  context: InvocationContext,
) {
  return getOrLoadCache<FileItem[]>({
    context,
    key: `files:${requestContext.principal.userId}`,
    ttlSeconds: 90,
    loader: async () => {
      try {
        return {
          source: 'graph',
          value: await loadGraphFiles(requestContext),
        } as const
      } catch (error) {
        if (getGraphConfig().mode === 'live') {
          throw error
        }

        logWarning(context, 'Using seeded recent files', {
          reason: error instanceof Error ? error.message : 'Unknown error',
          userId: requestContext.principal.userId,
        })

        return {
          source: 'seeded',
          value: seededRecentFiles,
        } as const
      }
    },
  })
}
