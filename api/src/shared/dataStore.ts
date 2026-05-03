import type {
  ChatTokenResponse,
  NavigationItem,
  OrgNode,
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

let navigationItems = [...defaultNavigation]
const preferenceStore = new Map<string, UserPreferences>()

export function getNavigation() {
  return navigationItems
}

export function setNavigation(items: NavigationItem[]) {
  navigationItems = items
  return navigationItems
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
