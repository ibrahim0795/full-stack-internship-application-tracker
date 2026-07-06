# Production deployment

CareerOrbit is designed for Vercel and managed PostgreSQL, but it can run on any Node-compatible platform that supports Next.js and persistent environment variables.

## Required production resources

1. A managed PostgreSQL database with TLS-enabled connections.
2. A Vercel project connected to this GitHub repository.
3. A cryptographically random `AUTH_SECRET` of at least 32 characters.
4. The canonical HTTPS application URL.
5. Optional GitHub OAuth and transactional-email credentials.

No production credentials belong in Git, pull requests, screenshots, logs, or client-side environment variables.

## Environment variables

| Variable              | Required | Purpose                                         |
| --------------------- | -------- | ----------------------------------------------- |
| `DATABASE_URL`        | Yes      | Production PostgreSQL connection used by Prisma |
| `AUTH_SECRET`         | Yes      | Auth.js session and token security              |
| `NEXT_PUBLIC_APP_URL` | Yes      | Canonical HTTPS URL and metadata base           |
| `AUTH_GITHUB_ID`      | No       | GitHub OAuth client identifier                  |
| `AUTH_GITHUB_SECRET`  | No       | GitHub OAuth client secret                      |
| `RESEND_API_KEY`      | No       | Password-reset email delivery                   |
| `AUTH_EMAIL_FROM`     | No       | Verified reset-email sender                     |

`E2E_DATABASE_URL` is test-only and must not point at production.

## First deployment

1. Create the production database and copy its pooled, TLS-enabled connection string.
2. Configure all required variables in the hosting provider for Production and separate Preview values where appropriate.
3. Apply migrations from a trusted terminal or protected deployment job:

   ```bash
   DATABASE_URL="production-connection" npm run db:deploy
   ```

4. Connect the repository to Vercel and deploy `main`.
5. Visit `/api/health`; expect HTTP 200 with `status: "ok"`.
6. Register a fresh account and verify login, application CRUD, Kanban persistence, calendar, interview preparation, CV management, and logout.

Migrations are deliberately not run inside `npm run build`. Schema changes should be applied as an explicit release operation so a failed migration cannot be hidden inside an application build.

## Demo data

`npm run db:seed` creates a clearly labeled fictional demo workspace. Run it only when a public demo account is intentionally required. Never seed personal, preview, or production customer data, and change the demo password before sharing access.

## Health and monitoring

`GET /api/health` performs a minimal database query. It returns 200 when the service and database are ready and 503 when the database is unavailable. The response exposes no credentials, query errors, infrastructure names, or user data.

Configure uptime monitoring against this endpoint and provider alerts for failed deployments, elevated server errors, database capacity, and connection exhaustion.

## Rollback

1. Stop promotion if CI, migration, or smoke checks fail.
2. Restore the previous Vercel deployment for application-code regressions.
3. Prefer forward-fix migrations. Database rollback requires a reviewed, explicit migration and a verified backup; never edit production migration history manually.
4. Re-run `/api/health` and critical smoke tests after recovery.

## Release checklist

- [ ] CI succeeds on the release commit.
- [ ] Production variables are configured in the provider, not GitHub source files.
- [ ] Database backup and migration plan are confirmed.
- [ ] `npm run db:deploy` succeeds.
- [ ] Vercel production deployment succeeds.
- [ ] `/api/health` returns HTTP 200.
- [ ] Authentication and private-record ownership checks pass.
- [ ] Desktop and mobile smoke checks pass.
- [ ] README live-demo and screenshot links are updated.
