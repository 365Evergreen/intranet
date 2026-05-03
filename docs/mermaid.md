flowchart TD

    %% App Shell
    A[App Shell\n• Routing\n• ThemeProvider\n• Auth Context\n• Layouts] 
        --> B[Navigation Layer\n• Config-driven menu\n• Role-aware nav]

    %% Navigation to Features
    B --> C[Feature Modules]

    %% Feature Modules Breakdown
    subgraph C[features/]
        C1[news\nSharePoint news feed]
        C2[dashboard\nPersonalised home]
        C3[search\nM365 + custom search]
        C4[files\nOneDrive + SharePoint]
        C5[people\nProfiles + org data]
        C6[tasks\nPlanner + To Do]
        C7[chat\nAI assistant]
        C8[admin\nConfig UI]
    end

    %% Shared Libraries
    A --> D[Shared Libraries\n• api\n• graph\n• hooks\n• utils\n• config]

    %% UI Components
    A --> E[UI Components\nFluent UI v9\nReusable + stateless]

    %% Data Layer
    A --> F[Data Layer\nReact Query / SWR\nAPI → Functions]

    %% Assets & Styles
    A --> G[Assets & Styles\nTokens\nReset\nBranding]

    %% Backend API
    F --> H[Azure Functions API\n• graph/*\n• search/*\n• storage/*\n• ai/*]

    %% Storage + Graph
    H --> I[Microsoft Graph]
    H --> J[Azure Storage\nTable + Blob]

    %% SWA Hosting
    A --> K[Azure Static Web Apps\nGlobal CDN]
