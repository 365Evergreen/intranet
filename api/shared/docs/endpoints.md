# API endpoints

## Current routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/me` | GET | Returns the SWA client principal or a local development fallback |
| `/api/dashboard` | GET | Returns dashboard highlights, quick links, and updates |
| `/api/storage/navigation` | GET, PUT | Reads and writes navigation configuration |
| `/api/storage/preferences` | GET, PUT | Reads and writes per-user preferences |
| `/api/storage/sas` | GET | Returns a placeholder SAS payload for approved blobs |
| `/api/storage/upload` | POST | Returns an upload path payload |
| `/api/graph/news` | GET | Returns seeded SharePoint-style news items |
| `/api/graph/files/recent` | GET | Returns recent file data |
| `/api/graph/people/profile` | GET | Returns profile details |
| `/api/graph/people/org` | GET | Returns manager and direct report records |
| `/api/graph/tasks` | GET | Returns seeded Planner and To Do items |
| `/api/search` | GET | Searches seeded intranet content |
| `/api/ai/token` | GET | Returns a Direct Line style token payload |
| `/api/ai/grounding` | GET | Returns grounding sections for the assistant |

## Notes
- The current implementation uses an in-memory store to keep the repo self-contained.
- Replace the seeded data layer with Graph, Table Storage, and Blob Storage adapters as production integration work begins.
