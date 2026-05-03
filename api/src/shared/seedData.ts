import type {
  DashboardUpdate,
  FileItem,
  NewsArticle,
  SearchResult,
} from './contracts'

export const seededNewsArticles: NewsArticle[] = [
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

export const seededRecentFiles: FileItem[] = [
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

export const seededSearchResults: SearchResult[] = [
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

export const seededDashboardUpdates: DashboardUpdate[] = [
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
]
