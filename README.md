
# **365 Evergreen Intranet — Azure Static Web Apps (SWA)**

A modern, mobile‑first intranet and personal assistant platform built on **Azure Static Web Apps**, **Azure Functions**, **Microsoft 365**, and **Fluent UI**. Designed for remote‑first organisations that need a secure, lightweight, globally accessible digital workplace without relying on direct SharePoint access.

This repository contains the full frontend and backend scaffolding for the Evergreen intranet experience — including M365 integration, AI‑powered assistance, and a clean, scalable architecture optimised for contributors and admins.

---

## **✨ Key Features**
### **Microsoft 365 Integration**
- **Graph API integration** via backend Functions (token-injected using SWA auth)
- **SharePoint content ingestion** (news, resources, lists, documents)
- **User‑specific content**: recent files, events, tasks, sites, and recommendations
- **People & org data**: profile card data, presence, org chart
- **Secure identity** via **Entra ID** with SWA built‑in auth

### **AI‑Powered Personal Assistant**
- Embedded **Copilot Studio agent** with Direct Line token provisioning
- Contextual grounding using:
  - User identity (UPN, name, roles)
  - SharePoint content
  - Intranet navigation metadata
  - Custom backend knowledge endpoints
- Adaptive Cards for structured interactions (forms, workflows, approvals)

### **Modern Intranet Experience**
- **Mobile‑first** design with collapsible Fluent UI sidebar
- **SharePoint‑like features** without SharePoint dependency:
  - News feed
  - Quick links
  - Tools & forms hub
  - Personalised dashboard
- **Config‑driven navigation** (admin‑friendly, no redeploys)
- **Role‑aware UI** for contributors, admins, and general users

### **Azure‑Native Architecture**
- **Azure Static Web Apps** for global CDN delivery
- **Azure Functions** backend for:
  - Graph proxying
  - AI grounding
  - Search aggregation
  - Storage access (SAS tokens, metadata)
- **Azure Table Storage** for lightweight, scalable data
- **Azure Blob Storage** for media, attachments, and cached content
- **SWA routing** for secure API boundaries

---

## **📁 Repository Structure**
```
/
├── frontend/                # React + Vite + Fluent UI app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Feature modules (news, tasks, chat, etc.)
│   │   ├── hooks/           # SWR/React Query hooks for data fetching
│   │   ├── layouts/         # Shell, sidebar, header
│   │   ├── pages/           # Routed pages
│   │   ├── services/        # API wrappers
│   │   └── styles/          # Fluent tokens, theming
│   └── staticwebapp.config.json
│
├── api/                     # Azure Functions backend
│   ├── graph/               # Graph API proxy functions
│   ├── ai/                  # Copilot grounding, Direct Line token
│   ├── storage/             # SAS token, metadata, uploads
│   ├── search/              # M365 + custom search aggregation
│   └── shared/              # Types, utilities, auth helpers
│
├── infra/                   # Optional Bicep/Terraform for provisioning
└── README.md                # You are here
```

---

## **🎨 Frontend Design Requirements**
The frontend follows **Fluent UI**, **Microsoft design language**, and **SWA‑friendly best practices**.

### **Fluent UI Principles**
- **Sentence case** for all headings and labels  
- **Consistent spacing** using Fluent tokens  
- **Neutral palette** with brand accents  
- **Responsive grid** for mobile‑first layouts  
- **Accessible by default** (WCAG AA)

### **Component Architecture**
- Use **feature‑based folders** (not giant shared folders)
- Keep components **pure and stateless** where possible
- Use **React Query or SWR** for data fetching with background revalidation
- Use **Context** only for global state (theme, user, nav)
- Prefer **Adaptive Cards** for structured AI interactions

### **Performance Best Practices**
- Lazy‑load feature routes
- Cache Graph responses in the backend where appropriate
- Use SWA’s global CDN for static assets
- Avoid large client bundles — keep dependencies tight

---

## **⚙️ Backend Design Requirements**
The backend is built for **security**, **scalability**, and **admin‑friendly maintenance**.

### **Azure Functions Best Practices**
- **One responsibility per function**
- **Shared utilities** for:
  - Graph client creation
  - Token validation
  - Logging
  - Error handling
- **Typed request/response models** (TypeScript)
- **Idempotent operations** for provisioning and updates
- **Retry‑safe patterns** for Graph and Storage

### **Graph API Integration**
- Use **SWA‑injected identity** (`x-ms-client-principal`)
- Backend obtains delegated Graph tokens securely
- Never expose Graph tokens to the frontend
- Cache expensive Graph calls (e.g., search, profile, org data)

### **Storage Architecture**
- **Table Storage** for:
  - Navigation config
  - User preferences
  - AI grounding metadata
- **Blob Storage** for:
  - News images
  - Attachments
  - Cached content
- **SAS tokens** generated server‑side only

### **AI Integration**
- Direct Line token endpoint:
  - Validates user identity
  - Injects user metadata
  - Applies conversation grounding
- AI endpoints must:
  - Avoid leaking internal system messages
  - Use strict schemas for grounding
  - Log safely without PII

---

## **🚀 Local Development**
### **Prerequisites**
- Node.js LTS
- Azure Functions Core Tools
- Azure Static Web Apps CLI
- pnpm (recommended)

### **Install**
```
pnpm install
```

### **Run frontend + backend locally**
```
pnpm dev
```

This launches:
- Vite dev server  
- Functions backend  
- SWA emulator with auth simulation  

---

## **🔐 Authentication**
Authentication is handled by **Azure Static Web Apps + Entra ID**.

- No auth logic lives in the frontend  
- Backend receives user identity via headers  
- Graph tokens are obtained server‑side  

---

## **🧩 Configuration**
### **Environment Variables**
Backend Functions require:

```
GRAPH_CLIENT_ID=
GRAPH_TENANT_ID=
GRAPH_CLIENT_SECRET=
GRAPH_MODE=hybrid
GRAPH_NEWS_SITE_IDS=
GRAPH_SEARCH_ENTITY_TYPES=site,listItem,driveItem
GRAPH_CACHE_TABLE_NAME=GraphCache
STORAGE_ACCOUNT=
STORAGE_KEY=
DIRECT_LINE_SECRET=
```

- `GRAPH_MODE=hybrid` keeps the app responsive by using cache-backed seeded fallbacks when live Graph prerequisites are unavailable.
- `GRAPH_NEWS_SITE_IDS` should contain one or more SharePoint site IDs for the news feed.
- `STORAGE_ACCOUNT` and `STORAGE_KEY` enable persistent cross-instance Graph caching in Azure Table Storage.

Frontend uses a minimal `.env`:

```
VITE_API_BASE=/api
```

---

## **🧪 Testing**
- Unit tests for utilities and components  
- Integration tests for API endpoints  
- Playwright tests for core user flows  

---

## **📦 Deployment**
Deployment is automatic via SWA GitHub Actions:

- Push to `main` → build → deploy  
- Preview environments for PRs  
- Global CDN distribution  

---

## **📚 Contributing**
- Follow the feature‑folder structure  
- Use TypeScript everywhere  
- Keep PRs small and focused  
- Document new endpoints in `/api/shared/docs`  
- Use AU/UK locale formats (no US defaults)  

---

## **🗺️ Roadmap**
- Full mega menu config UI  
- Offline‑ready PWA mode  
- AI‑powered search with hybrid grounding  
- Contributor dashboard  
- Admin analytics  

---
# intranet
