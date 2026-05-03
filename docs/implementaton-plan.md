365 Evergreen Intranet — SWA Development Plan

Phase 0 — Repository & Tooling Setup


Initialise a pnpm workspace (monorepo root package.json) with workspaces for frontend/ and api/

Scaffold the frontend with Vite + React + TypeScript (pnpm create vite frontend --template react-ts)

Scaffold the API with Azure Functions v4 (Node/TypeScript) (func init api --typescript)

Add root-level pnpm dev script that runs swa start (SWA CLI) wiring Vite dev server + Functions emulator

Add .env.example for both frontend (VITE_API_BASE) and API (GRAPH_CLIENT_ID, GRAPH_TENANT_ID, etc.)

Configure staticwebapp.config.json with auth (Entra ID), API route rules, and fallback for the SPA

Update the existing GitHub Actions workflow (app_location, api_location, output_location) to match actual build paths (frontend/dist)

Set up ESLint + Prettier + TypeScript strict mode



Phase 1 — App Shell & Auth Foundation


Install Fluent UI v9 (@fluentui/react-components) and configure FluentProvider with a custom brand token

Implement ShellLayout (header bar, collapsible sidebar, content area) and MinimalLayout (login/error pages)

Implement AuthContext: read x-ms-client-principal header from the SWA /auth/me endpoint; expose user, roles, and claims

Add useAuth hook; protect routes with a <RequireAuth> guard component

Set up React Router v6 with lazy-loaded feature routes

Add global styles (tokens.css, reset.css) using Fluent spacing/colour tokens



Phase 2 — Backend Shared Utilities (API)


Create api/shared/ with:

graphClient.ts — builds an authenticated Graph client using OBO flow from the SWA-injected token

auth.ts — validates and extracts x-ms-client-principal

errorHandler.ts — consistent error response wrapper

logger.ts — structured logging (no PII)

storageClient.ts — Table Storage and Blob Storage clients from env vars



Define shared TypeScript types/interfaces for Graph responses, storage models, and API contracts



Phase 3 — Navigation & Config System


API: GET /api/storage/navigation — reads nav config from Azure Table Storage; caches in memory with TTL

Frontend: NavigationContext + useNavigation hook consuming the above endpoint via React Query

Build SidebarNav component: config-driven, collapsible, role-aware, mobile-responsive

Build MegaMenu (desktop) component with the same config source

Admin: features/admin/ page with a form UI to read/write nav config to Table Storage via PUT /api/storage/navigation



Phase 4 — Feature Modules (Core)

Build each feature module with the structure: components/, hooks/, services/, types/, index.ts


4a — Dashboard (features/dashboard/)


Personalised home page combining news, recent files, tasks, and quick links

Skeleton loaders while data fetches in parallel


4b — News (features/news/)


GET /api/graph/news — proxies SharePoint news pages via Graph (/sites/{site}/pages)

NewsFeed, NewsCard, NewsDetail components

Pagination and featured article hero


4c — Files (features/files/)


GET /api/graph/files/recent — proxies Graph /me/drive/recent

GET /api/graph/files/sites — SharePoint document libraries

File list with type icons, open/preview links


4d — People (features/people/)


GET /api/graph/people/profile — /me + profile photo

GET /api/graph/people/org — manager + direct reports

GET /api/graph/people/presence — batch presence lookup

ProfileCard, OrgChart, PeopleSearch components


4e — Tasks (features/tasks/)


GET /api/graph/tasks — Planner tasks + To Do items

Task list with status, due date, priority


4f — Search (features/search/)


GET /api/search?q= — aggregates Microsoft Search (Graph /search/query) + custom storage results

Unified result list with facets; deep-link support



Phase 5 — AI Assistant (features/chat/)


API: GET /api/ai/token — validates user identity, injects UPN/name/roles, calls Direct Line Token API, returns short-lived token only

API: GET /api/ai/grounding — returns user context, nav metadata, and org data for bot grounding

Frontend: embedded chat panel using the botframework-webchat SDK, initialised with the Direct Line token

AdaptiveCardHost component for rendering bot-sent Adaptive Cards

Never expose DIRECT_LINE_SECRET to the client



Phase 6 — Storage & Media


GET /api/storage/sas?blob= — generates short-lived read SAS token for approved blobs (server-side only)

POST /api/storage/upload — accepts multipart, stores to Blob, returns blob path

GET /api/storage/preferences — reads/writes per-user preferences from Table Storage (keyed on UPN)

Wire user preferences (theme, pinned links) into AuthContext/UserPreferencesContext



Phase 7 — Testing


Unit tests (Vitest + React Testing Library): utilities, hooks, and pure components

API integration tests (Jest): each Function handler with mocked Graph/Storage clients

E2E tests (Playwright): core user flows — login, dashboard load, news browsing, search, AI chat open



Phase 8 — Performance & Polish


Verify all feature routes are code-split and lazy-loaded

Add stale-while-revalidate headers on cacheable API responses

Implement backend Graph response caching (in-memory or Table Storage) for expensive calls (search, org data)

Lighthouse / Web Vitals audit; address any WCAG AA accessibility gaps

Add PWA manifest + service worker for offline shell (roadmap item)



Phase 9 — Infrastructure (Optional / Parallel)


Write Bicep templates in infra/ for:

Static Web App resource

Azure Functions (bundled with SWA)

Storage Account (Table + Blob containers)

Entra ID App Registration (with redirect URIs)



Add a pnpm infra:deploy script that runs az deployment group create



Phase 10 — Documentation & Contributor Onboarding


Fill in docs/PRD.md with acceptance criteria for each feature

Add CONTRIBUTING.md covering branch strategy, PR template, and code style

Document all API endpoints in api/shared/docs/

Add docs/adr/ (Architecture Decision Records) for key choices (SWR vs React Query, Table Storage schema, etc.)



Cross-cutting concerns (apply throughout)


TypeScript strict mode everywhere; no any

AU/UK locale formats (dates, currency) in all formatters

Sentence case in all UI text; Fluent tokens for all spacing/colour

All Graph tokens obtained server-side; nothing sensitive exposed to the browser

No PII in logs; structured logging with correlation IDs