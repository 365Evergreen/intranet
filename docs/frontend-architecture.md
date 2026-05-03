# **🌿 Frontend Architecture Diagram (React + Vite + Fluent UI + SWA)**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             FRONTEND (React)                             │
│                        Azure Static Web Apps (SWA)                       │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────── App Shell ────────────────────────────────┐
│  • <App />                                                              │
│  • Routing (React Router)                                               │
│  • ThemeProvider (Fluent UI v9)                                         │
│  • Auth context (user, roles, claims)                                   │
│  • Layouts:                                                             │
│      - ShellLayout (header, sidebar, content)                           │
│      - MinimalLayout (login, errors)                                    │
└──────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── Navigation Layer ───────────────────────────┐
│  • Config-driven mega menu (Table Storage → API → frontend cache)        │
│  • Role-aware navigation                                                 │
│  • Personalised quick links                                             │
└──────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── Feature Modules ────────────────────────────┐
│  Each feature is isolated in its own folder:                             │
│                                                                          │
│  features/                                                               │
│    ├── news/            # SharePoint news feed                           │
│    ├── dashboard/       # Personalised home experience                   │
│    ├── search/          # M365 + custom search                           │
│    ├── files/           # Recent files, OneDrive, SharePoint             │
│    ├── people/          # Profile cards, org data                        │
│    ├── tasks/           # Planner/To Do integration                      │
│    ├── chat/            # AI assistant (Copilot Studio)                  │
│    └── admin/           # Config UI for navigation + metadata            │
│                                                                          │
│  Each module contains:                                                   │
│    • components/                                                         │
│    • hooks/ (React Query/SWR)                                            │
│    • services/ (API wrappers)                                            │
│    • types/                                                              │
│    • index.ts                                                            │
└──────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── Shared Libraries ───────────────────────────┐
│  lib/                                                                    │
│    ├── api/           # Fetch wrappers, error handling, auth headers     │
│    ├── graph/         # Graph-specific helpers                           │
│    ├── hooks/         # useMediaQuery, useDebounce, useScrollLock        │
│    ├── utils/         # formatters, mappers, date helpers                │
│    ├── storage/       # Local/session storage helpers                    │
│    └── config/        # Environment, feature flags                       │
└──────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── UI Components ──────────────────────────────┐
│  components/                                                              │
│    ├── Button/                                                            │
│    ├── Card/                                                              │
│    ├── PageHeader/                                                        │
│    ├── SidebarNav/                                                        │
│    ├── UserAvatar/                                                        │
│    └── AdaptiveCardHost/                                                  │
│                                                                          │
│  • Fluent UI v9 tokens + theming                                          │
│  • Sentence case, spacing tokens, accessibility                           │
│  • Reusable, stateless, composable                                        │
└──────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── Data Layer ─────────────────────────────────┐
│  • React Query or SWR for:                                                │
│      - caching                                                            │
│      - background revalidation                                            │
│      - stale-while-revalidate                                             │
│  • API endpoints (SWA Functions):                                         │
│      - /api/graph/*                                                       │
│      - /api/search/*                                                      │
│      - /api/storage/*                                                     │
│      - /api/ai/*                                                          │
│  • No direct Graph calls from frontend                                    │
└──────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────── Assets & Styles ────────────────────────────┐
│  assets/                                                                  │
│    ├── images/                                                            │
│    ├── icons/                                                             │
│    └── fonts/                                                             │
│                                                                          │
│  styles/                                                                  │
│    ├── tokens.css                                                         │
│    ├── reset.css                                                          │
│    └── mixins.css                                                         │
└──────────────────────────────────────────────────────────────────────────┘
```

---

# **🧠 How to Read This Architecture**
This diagram reflects the **Evergreen philosophy** you’ve been building:

### **1. Feature‑based architecture**
Each domain (news, search, tasks, AI chat) is isolated, testable, and independently maintainable.

### **2. Fluent UI as the design backbone**
- Sentence case  
- Fluent spacing tokens  
- Neutral palette with brand accents  
- Accessibility baked in  

### **3. SWA‑friendly performance**
- Global CDN  
- Lazy‑loaded routes  
- Minimal bundle size  
- API calls routed through Functions  

### **4. AI as a first‑class feature**
The `chat/` feature integrates:
- Direct Line token endpoint  
- Adaptive Cards  
- Grounding metadata  
- User context injection  

### **5. Admin‑friendly configuration**
Navigation, metadata, and feature flags come from:
- Azure Table Storage  
- Cached via backend  
- Hydrated into the frontend  

---
