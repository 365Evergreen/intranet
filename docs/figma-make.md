# **🎨 Figma Make Prompt — Frontend Architecture Diagram**

Paste this directly into **Figma Make** to generate a polished, Fluent‑aligned architecture diagram.

---

## **Figma Make Prompt**

**Title:** *Evergreen SWA Intranet — Frontend Architecture Diagram*

**Prompt:**

Create a clean, modern architecture diagram for a React + Azure Static Web Apps intranet frontend. Use a Fluent UI–inspired visual style with rounded rectangles, subtle shadows, neutral greys, and Evergreen green accents. Use sentence case for all labels.

The diagram should show the following layers, arranged vertically from top to bottom, with clear grouping and spacing:

1. **App shell**
   - Routing (React Router)
   - ThemeProvider (Fluent UI v9)
   - Auth context (user, roles, claims)
   - Layouts (shell layout, minimal layout)

2. **Navigation layer**
   - Config-driven mega menu
   - Role-aware navigation
   - Quick links

3. **Feature modules** (grouped as a horizontal grid)
   - News
   - Dashboard
   - Search
   - Files
   - People
   - Tasks
   - Chat (AI assistant)
   - Admin (config UI)

4. **Shared libraries**
   - API wrappers
   - Graph helpers
   - Hooks
   - Utilities
   - Config

5. **UI components**
   - Fluent UI v9 components
   - Reusable, stateless, accessible

6. **Data layer**
   - React Query or SWR
   - Background revalidation
   - API calls to Azure Functions

7. **Backend/API boundary**
   - /api/graph/*
   - /api/search/*
   - /api/storage/*
   - /api/ai/*

8. **External services**
   - Microsoft Graph
   - Azure Storage (Table + Blob)

9. **Hosting**
   - Azure Static Web Apps (global CDN)

Design requirements:
- Use a left‑to‑right flow where appropriate, but maintain a clear vertical hierarchy.
- Use Evergreen brand colours subtly (greens for highlights, neutrals for structure).
- Include icons where helpful (browser, API, database, cloud).
- Keep the diagram clean, minimal, and enterprise‑ready.

Output as a single, well‑structured diagram suitable for documentation and onboarding.

---
