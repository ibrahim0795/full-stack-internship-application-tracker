# Testing strategy

CareerOrbit uses layered tests so fast feedback stays local while the most realistic workflows can run against an isolated PostgreSQL database.

## Test layers

- **Unit tests** cover Zod schemas, authentication helpers, timezone conversion, dashboard calculations, event aggregation, storage resolution, and capability decisions.
- **Component tests** cover accessible fields, responsive navigation, application, interview, CV forms, and optimistic Kanban behavior.
- **Repository contract tests** verify that private list and detail reads always include the authenticated owner ID.
- **Public browser tests** cover the landing experience, navigation, reduced motion, keyboard focus, responsive overflow, authentication entry points, and protected-route redirects.
- **Authenticated browser tests** cover registration, application creation, editing, filtering, stage movement, deletion, and cross-user isolation.

Reusable deterministic factories live in `src/test/factories.ts`. They use fixed dates and resettable identifiers so failures do not depend on wall-clock time or test order.

## Commands

```bash
npm test
npm run test:e2e
```

`npm test` never requires a database. Public Playwright tests also run without a working database because protected pages are verified at the authorization boundary.

## Database-backed browser tests

Authenticated workflows are intentionally skipped unless `E2E_DATABASE_URL` points to a disposable PostgreSQL database. Never point this variable at development, preview, or production data because tests create and delete records.

```powershell
$env:E2E_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/careerorbit_e2e"
$env:DATABASE_URL=$env:E2E_DATABASE_URL
npm run db:migrate
npm run test:e2e
```

The Playwright server automatically prefers `E2E_DATABASE_URL`. Each run creates uniquely named accounts to avoid collisions. Cross-user isolation is tested through the real authentication, route, server-action, repository, and database stack.

## CI expectations

CI should run formatting, linting, strict type checking, unit/component tests, public browser tests, a production build, and then database-backed browser tests against an ephemeral PostgreSQL service. Test artifacts and traces should be retained only for failed runs.
