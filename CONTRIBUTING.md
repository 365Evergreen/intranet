# Contributing

## Branching and pull requests
- Work from short-lived feature branches off `main`.
- Keep pull requests focused on one change set or vertical slice.
- Include screenshots or short API notes when UI or endpoint behaviour changes.

## Local workflow
1. Install dependencies with `pnpm install`.
2. Start the local SWA experience with `pnpm dev`.
3. Run `pnpm build`, `pnpm lint`, and `pnpm test` before opening a pull request.

## Code style
- Use TypeScript throughout the frontend and API code.
- Follow sentence case for visible UI text.
- Prefer feature-oriented frontend folders and shared API utilities over duplicated logic.
- Keep logs structured and avoid PII in log messages.

## Documentation
- Update `docs\PRD.md` when MVP scope or acceptance criteria change.
- Document new API routes in `api\shared\docs\`.
- Capture major architecture choices in `docs\adr\`.
