import type {
  ChatTokenResponse,
  DashboardSummary,
  FileItem,
  NavigationItem,
  NewsArticle,
  OrgNode,
  SearchResult,
  TaskItem,
  UserPreferences,
  UserProfile,
} from './contracts'

const defaultNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    description: 'Personal landing page',
  },
  {
    id: 'news',
    label: 'News',
    path: '/news',
    description: 'Updates and announcements',
  },
  {
    id: 'files',
    label: 'Files',
    path: '/files',
    description: 'Recent documents and libraries',
  },
  {
    id: 'people',
    label: 'People',
    path: '/people',
    description: 'Profiles and org data',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    description: 'Planner and To Do overview',
  },
  {
    id: 'search',
    label: 'Search',
    path: '/search',
    description: 'Unified search entry point',
  },
  {
    id: 'chat',
    label: 'Assistant',
    path: '/chat',
    description: 'Grounded AI assistant',
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin',
    description: 'Configuration workspace',
    roles: ['admin'],
  },
]

const newsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Quarterly strategy update',
    summary: 'Leadership has published the roadmap for the next quarter.',
    category: 'Leadership',
    publishedAt: '2026-05-01T08:00:00.000Z',
  },
  {
    id: 'news-2',
    title: 'Hybrid work toolkit refreshed',
    summary: 'New starter kits and templates are available for distributed teams.',
    category: 'Operations',
    publishedAt: '2026-04-26T08:00:00.000Z',
  },
]

const recentFiles: FileItem[] = [
  {
    id: 'file-1',
    name: 'Project kickoff deck.pptx',
    location: 'SharePoint / Strategy',
    type: 'PowerPoint',
    updatedAt: '2026-05-02T08:00:00.000Z',
    url: '#',
  },
  {
    id: 'file-2',
    name: 'Intranet nav schema.xlsx',
    location: 'OneDrive / Shared',
    type: 'Excel',
    updatedAt: '2026-05-01T05:30:00.000Z',
    url: '#',
  },
]

const userProfile: UserProfile = {
  name: 'Mika Everett',
  title: 'Digital workplace manager',
  location: 'Brisbane',
  email: 'mika.everett@365evergreen.example',
  availability: 'Available',
}

const orgNodes: OrgNode[] = [
  {
    id: 'person-1',
    name: 'Chris Harding',
    title: 'Head of operations',
    relationship: 'Manager',
  },
  {
    id: 'person-2',
    name: 'Lena Wu',
    title: 'Intranet specialist',
    relationship: 'Direct report',
  },
]

const taskItems: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Review navigation labels',
    source: 'Planner',
    status: 'In progress',
    priority: 'High',
    dueDate: '2026-05-04T08:00:00.000Z',
  },
  {
    id: 'task-2',
    title: 'Confirm launch communications',
    source: 'Microsoft To Do',
    status: 'Not started',
    priority: 'Medium',
    dueDate: '2026-05-06T08:00:00.000Z',
  },
]

const searchResults: SearchResult[] = [
  {
    id: 'search-1',
    title: 'Hybrid search rollout notes',
    kind: 'SharePoint page',
    summary: 'Architecture and governance notes for combined Graph and storage search.',
    url: '/search',
  },
  {
    id: 'search-2',
    title: 'Navigation governance policy',
    kind: 'Knowledge article',
    summary: 'Rules for role-aware navigation and ownership.',
    url: '/admin',
  },
]

let navigationItems = [...defaultNavigation]
const preferenceStore = new Map<string, UserPreferences>()

export function getNavigation() {
  return navigationItems
}

export function setNavigation(items: NavigationItem[]) {
  navigationItems = items
  return navigationItems
}

export function getDashboard(): DashboardSummary {
  return {
    welcome:
      'Your intranet MVP is running on Azure Static Web Apps with a React shell and Functions API.',
    highlights: [
      { label: 'Unread updates', value: '6', trend: '+2 today' },
      { label: 'Files in focus', value: '12', trend: '3 shared' },
      { label: 'Assigned tasks', value: '7', trend: '2 due soon' },
    ],
    quickLinks: navigationItems.slice(0, 4),
    updates: [
      {
        id: 'update-1',
        title: 'Navigation API online',
        summary: 'Role-aware navigation can now be edited from the admin area.',
      },
      {
        id: 'update-2',
        title: 'People and tasks seeded',
        summary: 'Frontend feature modules now resolve against real API routes.',
      },
    ],
  }
}

export function getNews() {
  return newsArticles
}

export function getFiles() {
  return recentFiles
}

export function getUserProfile() {
  return userProfile
}

export function getOrgNodes() {
  return orgNodes
}

export function getTasks() {
  return taskItems
}

export function searchContent(query: string) {
  const loweredQuery = query.toLowerCase()
  return searchResults.filter(
    (result) =>
      result.title.toLowerCase().includes(loweredQuery) ||
      result.summary.toLowerCase().includes(loweredQuery),
  )
}

export function getPreferences(userId: string) {
  return (
    preferenceStore.get(userId) ?? {
      theme: 'light',
      pinnedNavIds: ['dashboard', 'news', 'search'],
    }
  )
}

export function setPreferences(userId: string, preferences: UserPreferences) {
  preferenceStore.set(userId, preferences)
  return preferences
}

export function getChatToken(): ChatTokenResponse {
  return {
    token: 'local-direct-line-token',
    expiresAt: '2026-05-05T08:00:00.000Z',
  }
}
