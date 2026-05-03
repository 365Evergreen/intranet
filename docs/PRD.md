# 365 Evergreen intranet MVP PRD

## Goal
Deliver a usable Azure Static Web Apps intranet MVP that provides a secure shell, role-aware navigation, core work surfaces, and an API-backed integration boundary for future Microsoft 365 and AI expansion.

## MVP scope
1. **Workspace foundation**
   - pnpm workspace with `frontend\` and `api\`
   - Local SWA development script
   - Strict TypeScript, ESLint, and Prettier
2. **Shell and identity**
   - Fluent UI v9 shell with header, sidebar, responsive layout, and route protection
   - Auth bootstrap from SWA `/auth/me` with a local-development fallback principal
3. **Navigation and admin**
   - Role-aware navigation read from the API
   - Admin page for editing navigation JSON via `PUT /api/storage/navigation`
4. **Core intranet modules**
   - Dashboard, news, files, people, tasks, and search pages
   - Each feature reads from API routes rather than hardcoded UI-only state
5. **AI and preferences**
   - Direct Line token endpoint, grounding endpoint, and assistant surface
   - User preference persistence for theme and pinned items

## Acceptance criteria

### Foundation
- `pnpm install`, `pnpm build`, `pnpm lint`, and `pnpm test` succeed from the repo root.
- The repository contains `frontend\`, `api\`, and `infra\` directories aligned to the documented structure.
- Frontend and API environment variable examples exist.

### Shell and identity
- The app renders a Fluent UI shell with header and collapsible navigation.
- Protected routes redirect unauthenticated users away from the main shell.
- The frontend resolves user details from `/auth/me` when available and falls back safely during local development.

### Navigation and admin
- Navigation is returned from `GET /api/storage/navigation`.
- The admin experience can submit an updated navigation payload to `PUT /api/storage/navigation`.
- Navigation items can be restricted by role and the admin entry remains admin-only.

### Core modules
- Dashboard, news, files, people, tasks, and search each have a routed page and API integration.
- Search accepts a query string and returns filtered results.
- People and tasks views show data coming from the API layer.

### AI and preferences
- `GET /api/ai/token` returns a short-lived client token payload.
- `GET /api/ai/grounding` returns user and navigation context for grounding.
- `GET` and `PUT /api/storage/preferences` round-trip user preferences.

## Non-MVP follow-on work
- Real delegated Graph integration using OBO flow
- Azure Table Storage and Blob Storage production implementations
- Copilot Studio Web Chat embedding
- End-to-end Playwright coverage
- Contributor analytics and admin reporting
