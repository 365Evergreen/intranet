# Microsoft Graph configuration

This project now supports a **cache-first Graph integration** for news, search, and recent files.

The current backend supports two practical operating modes:

- **`GRAPH_MODE=hybrid`**: recommended starting point. Use live Graph where configuration exists, and fall back to seeded content when it does not.
- **`GRAPH_MODE=live`**: force live Graph calls and fail fast if Graph prerequisites are missing.

## 1. Decide what you want live first

For the current implementation, configure these in order:

1. **News**
2. **Search**
3. **Recent files**

News and search can work with **application permissions**. Recent files are **user-specific** and need a **delegated token** strategy.

## 2. Create or reuse a Graph app registration

Use a **separate app registration for backend Graph access** rather than the SWA sign-in app. This keeps authentication and downstream API access easier to reason about.

Recommended naming:

- `intranet-graph-dev`

Portal path:

1. Open **Microsoft Entra ID**
2. Go to **App registrations**
3. Select **New registration**
4. Name it something like `intranet-graph-dev`
5. Keep it **single tenant**
6. Register the app

You need:

- **Application (client) ID**
- **Directory (tenant) ID**

## 3. Add Microsoft Graph permissions

Open the app registration and go to **API permissions**.

### Required for the current backend

#### Application permissions

These are used for **app-context** calls such as news and search.

- **Sites.Read.All** — required for SharePoint-backed news and broad site content retrieval

Recommended additions if your search scope expands into more document content:

- **Files.Read.All** — useful when search needs broader file/document coverage across Microsoft 365

#### Delegated permissions

These are needed for **per-user** calls such as `/me/drive/recent`.

- **Files.Read** — recommended minimum delegated permission for recent files
- **User.Read** — useful baseline delegated permission when adding more user-context Graph features later

### Admin consent

After adding permissions:

1. Select **Grant admin consent**
2. Confirm
3. Verify the permissions show as granted

Notes:

- **Application permissions always need admin consent**
- `Sites.Read.All` is the key permission for live SharePoint news

## 4. Create a client secret

In the same app registration:

1. Go to **Certificates & secrets**
2. Select **New client secret**
3. Copy the value immediately

Store:

- **Client secret value**

Do not commit it. Put it in Azure Static Web App application settings.

## 5. Identify the SharePoint site IDs for news

The backend expects:

```text
GRAPH_NEWS_SITE_IDS=<comma-separated-site-ids>
```

Use one of these methods:

### Option A: Graph Explorer

Call:

```http
GET https://graph.microsoft.com/v1.0/sites/{hostname}:/sites/{site-path}
```

Example:

```http
GET https://graph.microsoft.com/v1.0/sites/contoso.sharepoint.com:/sites/Intranet
```

Copy the returned `id`.

### Option B: Azure CLI + Graph token

```powershell
$token = az account get-access-token --resource-type ms-graph --query accessToken -o tsv
Invoke-RestMethod `
  -Headers @{ Authorization = \"Bearer $token\" } `
  -Uri \"https://graph.microsoft.com/v1.0/sites/contoso.sharepoint.com:/sites/Intranet\"
```

## 6. Configure the Static Web App application settings

Set these in the Azure Static Web App:

```text
GRAPH_CLIENT_ID=<backend graph app client id>
GRAPH_TENANT_ID=<tenant id>
GRAPH_CLIENT_SECRET=<backend graph app secret>
GRAPH_MODE=hybrid
GRAPH_NEWS_SITE_IDS=<comma-separated-site-ids>
GRAPH_SEARCH_ENTITY_TYPES=site,listItem,driveItem
GRAPH_CACHE_TABLE_NAME=GraphCache
STORAGE_ACCOUNT=<storage account name>
STORAGE_KEY=<storage account key>
```

### Meaning of each setting

- `GRAPH_CLIENT_ID` / `GRAPH_TENANT_ID` / `GRAPH_CLIENT_SECRET`: credentials for app-context Graph calls
- `GRAPH_MODE`: `hybrid` or `live`
- `GRAPH_NEWS_SITE_IDS`: SharePoint sites to read news from
- `GRAPH_SEARCH_ENTITY_TYPES`: Graph search entity types
- `GRAPH_CACHE_TABLE_NAME`: Azure Table Storage table name used for persistent Graph cache
- `STORAGE_ACCOUNT` / `STORAGE_KEY`: enables cross-instance persistent cache

### Azure CLI example

```powershell
az staticwebapp appsettings set `
  --name swa-intranet-dev `
  --resource-group rg-intranet-swa-dev `
  --setting-names `
    \"GRAPH_CLIENT_ID=<client-id>\" `
    \"GRAPH_TENANT_ID=<tenant-id>\" `
    \"GRAPH_CLIENT_SECRET=<client-secret>\" `
    \"GRAPH_MODE=hybrid\" `
    \"GRAPH_NEWS_SITE_IDS=<site-id>\" `
    \"GRAPH_SEARCH_ENTITY_TYPES=site,listItem,driveItem\" `
    \"GRAPH_CACHE_TABLE_NAME=GraphCache\" `
    \"STORAGE_ACCOUNT=<storage-account>\" `
    \"STORAGE_KEY=<storage-key>\"
```

## 7. Understand the recent files limitation

`/api/graph/files/recent` uses:

```text
GET /me/drive/recent
```

That is a **delegated** endpoint, which means the backend needs a **user token**, not just app credentials.

### Current behavior

- In **`GRAPH_MODE=hybrid`**, if a delegated token is not available, the app returns the seeded recent-file data instead of failing.
- In **`GRAPH_MODE=live`**, the endpoint fails fast until delegated token acquisition is implemented.

### What is still needed for truly live recent files

You need a server-side delegated token strategy, for example:

1. A request header that contains a usable Entra access token for Graph
2. An on-behalf-of flow
3. Another backend token acquisition path that produces a user-context Graph token

Until that is added, **news and search can be fully live**, while **recent files stay hybrid**.

## 8. Configure storage for persistent cache

If you want cache to survive host restarts and scale-out:

1. Use the Storage Account already provisioned for the app
2. Set:
   - `STORAGE_ACCOUNT`
   - `STORAGE_KEY`
3. Leave `GRAPH_CACHE_TABLE_NAME=GraphCache` unless you want a different table

The backend will then use:

- **in-memory cache** for fastest hot-path responses
- **Azure Table Storage** for cross-instance cache reuse

## 9. Deploy and verify

After updating settings:

1. Deploy through the existing GitHub Actions workflow
2. Verify:
   - `/api/graph/news`
   - `/api/search?q=intranet`
   - `/api/dashboard`

Expected results:

- news and search should come from live Graph when permissions and site IDs are correct
- recent files will only be live when delegated token acquisition exists

## 10. Recommended rollout path

For the current codebase, use this order:

1. Turn on **live news**
2. Turn on **live search**
3. Enable **persistent cache**
4. Add delegated token acquisition for **recent files**
5. Move other Graph-backed surfaces like people and tasks after that
