import {
  AzureNamedKeyCredential,
  TableClient,
  type TableEntityResult,
} from '@azure/data-tables'
import { createHash } from 'node:crypto'
import type { InvocationContext } from '@azure/functions'
import { logInfo, logWarning } from './logger'
import { getGraphConfig } from './graphConfig'

export type CacheLayer = 'memory' | 'persistent' | 'none'
export type DataSource = 'graph' | 'seeded'

export type CacheEntry<T> = {
  value: T
  source: DataSource
  cachedAt: string
  expiresAt: string
}

export type CachedValue<T> = CacheEntry<T> & {
  cacheLayer: CacheLayer
  isStale: boolean
}

type CacheLoader<T> = () => Promise<{
  source: DataSource
  value: T
}>

type CacheRequest<T> = {
  context: InvocationContext
  key: string
  ttlSeconds: number
  loader: CacheLoader<T>
}

type PersistedCacheEntity = {
  partitionKey: string
  rowKey: string
  payload: string
  source: DataSource
  cachedAt: string
  expiresAt: string
}

const memoryCache = new Map<string, CacheEntry<unknown>>()

let tableInitialization: Promise<TableClient | null> | null = null

function now() {
  return Date.now()
}

function createCacheEntry<T>(
  value: T,
  ttlSeconds: number,
  source: DataSource,
): CacheEntry<T> {
  const cachedAt = new Date().toISOString()
  const expiresAt = new Date(now() + ttlSeconds * 1000).toISOString()

  return {
    value,
    source,
    cachedAt,
    expiresAt,
  }
}

function isExpired(expiresAt: string) {
  return Date.parse(expiresAt) <= now()
}

function buildCacheHash(key: string) {
  return createHash('sha256').update(key).digest('hex')
}

function buildKeys(key: string) {
  const hash = buildCacheHash(key)

  return {
    partitionKey: hash.slice(0, 2),
    rowKey: hash,
  }
}

async function getCacheTableClient(): Promise<TableClient | null> {
  if (!tableInitialization) {
    tableInitialization = createCacheTableClient()
  }

  return tableInitialization
}

async function createCacheTableClient(): Promise<TableClient | null> {
  const config = getGraphConfig()
  const storageAccount = process.env.STORAGE_ACCOUNT
  const storageKey = process.env.STORAGE_KEY

  if (!storageAccount || !storageKey) {
    return null
  }

  const credential = new TableClient(
    `https://${storageAccount}.table.core.windows.net`,
    config.cacheTableName,
    new AzureNamedKeyCredential(storageAccount, storageKey),
  )

  await credential.createTable().catch(() => undefined)
  return credential
}

async function getPersistedValue<T>(key: string): Promise<CacheEntry<T> | null> {
  const client = await getCacheTableClient()

  if (!client) {
    return null
  }

  const { partitionKey, rowKey } = buildKeys(key)

  try {
    const entity = (await client.getEntity<PersistedCacheEntity>(
      partitionKey,
      rowKey,
    )) as TableEntityResult<PersistedCacheEntity>

    return {
      value: JSON.parse(entity.payload) as T,
      source: entity.source,
      cachedAt: entity.cachedAt,
      expiresAt: entity.expiresAt,
    }
  } catch {
    return null
  }
}

async function persistValue<T>(key: string, entry: CacheEntry<T>) {
  const client = await getCacheTableClient()

  if (!client) {
    return
  }

  const { partitionKey, rowKey } = buildKeys(key)

  await client.upsertEntity({
    partitionKey,
    rowKey,
    payload: JSON.stringify(entry.value),
    source: entry.source,
    cachedAt: entry.cachedAt,
    expiresAt: entry.expiresAt,
  })
}

async function refreshValue<T>(
  context: InvocationContext,
  key: string,
  ttlSeconds: number,
  loader: CacheLoader<T>,
) {
  const loaded = await loader()
  const entry = createCacheEntry(loaded.value, ttlSeconds, loaded.source)

  memoryCache.set(key, entry)
  await persistValue(key, entry)

  logInfo(context, 'Graph cache refreshed', {
    cacheKey: key,
    source: entry.source,
  })
}

export async function getOrLoadCache<T>({
  context,
  key,
  ttlSeconds,
  loader,
}: CacheRequest<T>): Promise<CachedValue<T>> {
  const inMemory = memoryCache.get(key) as CacheEntry<T> | undefined

  if (inMemory && !isExpired(inMemory.expiresAt)) {
    logInfo(context, 'Graph cache hit', {
      cacheKey: key,
      layer: 'memory',
      source: inMemory.source,
    })

    return {
      ...inMemory,
      cacheLayer: 'memory',
      isStale: false,
    }
  }

  const persisted = await getPersistedValue<T>(key)

  if (persisted && !isExpired(persisted.expiresAt)) {
    memoryCache.set(key, persisted)

    logInfo(context, 'Graph cache hit', {
      cacheKey: key,
      layer: 'persistent',
      source: persisted.source,
    })

    return {
      ...persisted,
      cacheLayer: 'persistent',
      isStale: false,
    }
  }

  if (persisted && isExpired(persisted.expiresAt)) {
    memoryCache.set(key, persisted)
    void refreshValue(context, key, ttlSeconds, loader).catch((error) =>
      logWarning(context, 'Graph cache background refresh failed', {
        cacheKey: key,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    )

    logInfo(context, 'Graph cache stale hit', {
      cacheKey: key,
      layer: 'persistent',
      source: persisted.source,
    })

    return {
      ...persisted,
      cacheLayer: 'persistent',
      isStale: true,
    }
  }

  const loaded = await loader()
  const entry = createCacheEntry(loaded.value, ttlSeconds, loaded.source)

  memoryCache.set(key, entry)
  await persistValue(key, entry)

  logInfo(context, 'Graph cache miss', {
    cacheKey: key,
    source: entry.source,
  })

  return {
    ...entry,
    cacheLayer: 'none',
    isStale: false,
  }
}
