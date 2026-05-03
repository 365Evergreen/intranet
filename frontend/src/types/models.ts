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

export type Highlight = {
  label: string
  value: string
  trend: string
}

export type DashboardUpdate = {
  id: string
  title: string
  summary: string
}

export type DashboardSummary = {
  welcome: string
  highlights: Highlight[]
  quickLinks: NavigationItem[]
  updates: DashboardUpdate[]
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

export type ChatTokenResponse = {
  token: string
  expiresAt: string
}

export type AiGroundingSection = {
  title: string
  items: string[]
}

export type AiGroundingResponse = {
  sections: AiGroundingSection[]
}

export type UserPreferences = {
  theme: 'light' | 'dark'
  pinnedNavIds: string[]
}
