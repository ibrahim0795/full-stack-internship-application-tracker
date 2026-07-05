# Authentication architecture

CareerOrbit uses Auth.js with JWT sessions and Prisma-backed user and OAuth account records. Credentials and optional GitHub OAuth share the same server-side authorization boundary.

## User journeys

- **Register:** validate with Zod, rate-limit by request address, hash with bcrypt, create the user, then start a session.
- **Sign in:** validate input, rate-limit by address and normalized email, perform a constant-cost password comparison, then issue a secure Auth.js session.
- **GitHub OAuth:** enabled only when both GitHub OAuth variables are configured. Auth.js stores the linked account through the Prisma adapter.
- **Forgot password:** always return the same response to prevent account discovery. Store only a SHA-256 hash of the random, single-use reset token.
- **Reset password:** validate strength, consume the unexpired token transactionally, replace the password hash, and remove existing reset tokens.
- **Protected routes:** Next.js proxy provides an early redirect, while every protected server page also checks `auth()` before loading private data.

## Local setup

1. Create a PostgreSQL database named `careerorbit`.
2. Copy `.env.example` to `.env.local` and replace `AUTH_SECRET` with a random value of at least 32 characters.
3. Run `npm run db:migrate` to create the authentication tables.
4. Run `npm run dev` and create an account at `/register`.

Generate a suitable secret in PowerShell:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

## Optional providers

GitHub sign-in requires `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`. Configure the OAuth callback as:

```text
http://localhost:3000/api/auth/callback/github
```

Password-reset email uses Resend when `RESEND_API_KEY`, `AUTH_EMAIL_FROM`, and `NEXT_PUBLIC_APP_URL` are configured. Without them, the reset flow deliberately does not claim that an email was delivered; the provider integration is ready for deployment configuration.

## Security notes

- Passwords are never logged or stored as plain text.
- Login failures do not reveal whether an account exists.
- Redirect targets are restricted to same-origin paths.
- Auth secrets and provider credentials are server-only environment variables.
- The in-memory limiter is a development boundary. Production deployment must replace it with a shared store such as Redis so limits work across instances.
- Phase 5 expands the Prisma schema with private application data and ownership indexes; it does not weaken these authentication boundaries.
