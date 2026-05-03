# ADR 0001: MVP architecture

## Status
Accepted

## Context
The repository started as documentation only, but the target architecture requires a React frontend, Azure Functions API, SWA routing, and a config-driven intranet shell. A full production integration with Graph, storage services, and Copilot Studio would take longer than the initial delivery window.

## Decision
Build the MVP as a pnpm workspace with:
- `frontend\` using React, Vite, Fluent UI, React Router, and React Query
- `api\` using Azure Functions v4 with shared auth, storage, error, and logging utilities
- seeded in-memory data behind API routes so the full shell and feature modules work before real service integrations are added

## Consequences
- The UI and API contract can be developed and tested immediately.
- Production integrations can replace the in-memory data layer behind stable endpoint shapes.
- The MVP remains honest about what is stubbed while still delivering a deployable SWA reference implementation.
