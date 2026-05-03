export type Claim = {
  typ: string
  val: string
}

export type ClientPrincipal = {
  userId: string
  userDetails: string
  userRoles: string[]
  claims: Claim[]
}

export type NavigationItem = {
  id: string
  label: string
  path: string
  description: string
  roles?: string[]
}

export type DashboardSummary = {
  welcome: string
  highlights: Array<{
    label: string
    value: string
    trend: string
  }>
  quickLinks: NavigationItem[]
  updates: Array<{
    id: string
    title: string
    summary: string
  }>
}

export type NewsArticle = {
  id: string
  title: string
  summary: string
  category: string
  publishedAt: string
}

export type FileItem = {
  id: string
  name: string
  location: string
  type: string
  updatedAt: string
  url: string
}

export type UserProfile = {
  name: string
  title: string
  location: string
  email: string
  availability: string
}

export type OrgNode = {
  id: string
  name: string
  title: string
  relationship: 'Manager' | 'Direct report'
}

export type TaskItem = {
  id: string
  title: string
  source: string
  status: string
  priority: string
  dueDate: string
}

export type SearchResult = {
  id: string
  title: string
  kind: string
  summary: string
  url: string
}

export type UserPreferences = {
  theme: 'light' | 'dark'
  pinnedNavIds: string[]
}

export type ChatTokenResponse = {
  token: string
  expiresAt: string
}

export type AiGroundingResponse = {
  sections: Array<{
    title: string
    items: string[]
  }>
}
