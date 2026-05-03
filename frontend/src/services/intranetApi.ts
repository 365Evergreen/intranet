import type {
  AiGroundingResponse,
  ChatTokenResponse,
  ClientPrincipal,
  DashboardSummary,
  FileItem,
  NavigationItem,
  NewsArticle,
  OrgNode,
  SearchResult,
  TaskItem,
  UserPreferences,
  UserProfile,
} from '../types/models'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export const defaultPrincipal: ClientPrincipal = {
  userId: 'local-user',
  userDetails: 'Mika Everett',
  userRoles: ['authenticated', 'admin'],
  claims: [],
}

export const defaultPreferences: UserPreferences = {
  theme: 'light',
  pinnedNavIds: ['dashboard', 'search', 'news'],
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`)
  }

  return (await response.json()) as T
}

export async function fetchAuthProfile(): Promise<ClientPrincipal | null> {
  try {
    const response = await fetch('/auth/me')
    if (response.ok) {
      const data = (await response.json()) as {
        clientPrincipal?: ClientPrincipal | null
      }
      return data.clientPrincipal ?? null
    }
  } catch {
    // SWA auth endpoint is not always available during local Vite-only dev.
  }

  return requestJson<ClientPrincipal | null>('/me')
}

export function fetchNavigation() {
  return requestJson<NavigationItem[]>('/storage/navigation')
}

export function updateNavigation(items: NavigationItem[]) {
  return requestJson<NavigationItem[]>('/storage/navigation', {
    method: 'PUT',
    body: JSON.stringify(items),
  })
}

export function fetchDashboard() {
  return requestJson<DashboardSummary>('/dashboard')
}

export function fetchNews() {
  return requestJson<NewsArticle[]>('/graph/news')
}

export function fetchFiles() {
  return requestJson<FileItem[]>('/graph/files/recent')
}

export async function fetchPeople() {
  const [profile, org] = await Promise.all([
    requestJson<UserProfile>('/graph/people/profile'),
    requestJson<OrgNode[]>('/graph/people/org'),
  ])

  return { profile, org }
}

export function fetchTasks() {
  return requestJson<TaskItem[]>('/graph/tasks')
}

export function fetchSearch(query: string) {
  return requestJson<SearchResult[]>(`/search?q=${encodeURIComponent(query)}`)
}

export function fetchChatToken() {
  return requestJson<ChatTokenResponse>('/ai/token')
}

export function fetchGrounding() {
  return requestJson<AiGroundingResponse>('/ai/grounding')
}

export function fetchPreferences() {
  return requestJson<UserPreferences>('/storage/preferences')
}

export function updatePreferences(preferences: UserPreferences) {
  return requestJson<UserPreferences>('/storage/preferences', {
    method: 'PUT',
    body: JSON.stringify(preferences),
  })
}
