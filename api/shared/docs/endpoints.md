# API endpoints

## Current routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/me` | GET | Returns the SWA client principal or a local development fallback |
| `/api/dashboard` | GET | Returns dashboard highlights plus cached news, files, and search suggestions |
| `/api/storage/navigation` | GET, PUT | Reads and writes navigation configuration |
| `/api/storage/preferences` | GET, PUT | Reads and writes per-user preferences |
| `/api/storage/sas` | GET | Returns a placeholder SAS payload for approved blobs |
| `/api/storage/upload` | POST | Returns an upload path payload |
| `/api/graph/news` | GET | Returns Graph-backed SharePoint news with cache-first fallback |
| `/api/graph/files/recent` | GET | Returns cached recent file data, using delegated Graph when available |
| `/api/graph/people/profile` | GET | Returns profile details |
| `/api/graph/people/org` | GET | Returns manager and direct report records |
| `/api/graph/tasks` | GET | Returns seeded Planner and To Do items |
| `/api/search` | GET | Returns cached Graph search results or seeded suggestions in hybrid mode |
| `/api/ai/token` | GET | Returns a Direct Line style token payload |
| `/api/ai/grounding` | GET | Returns grounding sections for the assistant |

## Notes
- News, files, and search now use a hybrid cache-first adapter layer with in-memory caching and optional persistent cache in Azure Table Storage.
- Set `GRAPH_MODE=live` to force real Graph calls, or leave the default `hybrid` mode to use seeded fallbacks when Graph prerequisites are missing.
- Shared Graph caches can persist in the `GRAPH_CACHE_TABLE_NAME` table when `STORAGE_ACCOUNT` and `STORAGE_KEY` are configured.
