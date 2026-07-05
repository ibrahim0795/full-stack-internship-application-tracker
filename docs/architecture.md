# CareerOrbit application architecture

## Architectural goals

CareerOrbit begins as a modular Next.js application: one deployable product with explicit feature boundaries. This keeps a junior-sized portfolio project understandable while demonstrating production practices. PostgreSQL remains the source of truth, and all private data access is authorised on the server.

The key constraints are:

- Server Components are the default; Client Components are limited to browser-only interaction.
- Essential content, forms, navigation, and data remain semantic HTML outside WebGL.
- Route handlers and server actions validate input, authenticate the session, and enforce record ownership.
- Features depend on shared primitives, but features do not reach into one another's internals.
- Database access is isolated from presentation code so it can be tested and changed safely.

## Runtime layers

1. **Presentation:** App Router layouts/pages, accessible HTML, reusable UI primitives, and progressive 3D enhancement.
2. **Input boundary:** React Hook Form on the client and Zod at both client and server boundaries.
3. **Application services:** use-case functions coordinate authorisation, business rules, repositories, logging, and transactions.
4. **Data access:** repositories use Prisma and accept an authenticated user identifier for private operations.
5. **Persistence:** PostgreSQL stores relational product data; external object storage will later store CV files.

## Request flow

```text
Browser -> App Router page/action -> Auth.js session -> Zod validation
        -> application service -> ownership-aware repository -> Prisma -> PostgreSQL
```

Read-heavy pages should fetch on the server. Mutations use server actions where they improve form ergonomics and route handlers where an HTTP contract is useful. Cache invalidation occurs only after a successful transaction.

## Proposed folder structure

```text
career-orbit/
|-- docs/
|-- prisma/
|   |-- migrations/
|   `-- schema.prisma
|-- public/
|   |-- models/
|   `-- textures/
|-- src/
|   |-- app/
|   |   |-- (marketing)/
|   |   |-- (auth)/
|   |   |-- (app)/
|   |   |-- api/auth/[...nextauth]/
|   |   |-- globals.css
|   |   `-- layout.tsx
|   |-- components/
|   |   |-- ui/
|   |   |-- layout/
|   |   |-- marketing/
|   |   `-- three/
|   |-- features/
|   |   |-- applications/
|   |   |-- analytics/
|   |   |-- calendar/
|   |   |-- interviews/
|   |   |-- reminders/
|   |   `-- resumes/
|   |-- lib/
|   |   |-- auth/
|   |   |-- db/
|   |   |-- env.ts
|   |   |-- errors/
|   |   |-- logging/
|   |   `-- utils/
|   |-- server/
|   |   |-- repositories/
|   |   `-- services/
|   `-- types/
|-- tests/e2e/
|-- .env.example
|-- playwright.config.ts
`-- vitest.config.ts
```

Each feature may contain `actions`, `components`, `data`, `schemas`, `tests`, and `types` subfolders when needed. A folder is introduced only when it has a real responsibility.

## Authentication and authorisation

Auth.js will manage sessions and OAuth accounts. Credentials registration will hash passwords with a dedicated password-hashing library before persistence. Page middleware may improve navigation, but it is never the security boundary.

Every private service receives the authenticated user ID. Repository queries scope records with both record ID and user ID, directly or through a parent relationship. Missing and unauthorised records produce the same public response to avoid leaking record existence.

## 3D boundary

The marketing page owns a dynamically imported Canvas. Scroll progress is translated into a small scene state rather than letting unrelated sections mutate the scene. HTML sections remain readable without JavaScript or WebGL. Reduced-motion and constrained-device modes render a lightweight visual fallback.

## Error and logging policy

- Expected validation and business-rule failures return safe, structured messages.
- Unexpected failures are logged on the server with request context but no credentials or CV contents.
- Browser messages never include stack traces, database errors, or secrets.
- Mutations that touch multiple records use a database transaction.

## Testing strategy

- Unit tests cover schemas, calculations, ownership helpers, and business rules.
- Component tests cover forms, error states, empty states, and accessible interaction.
- Integration tests cover repositories against a test database when the schema is implemented.
- Playwright covers the highest-value user journeys on desktop and mobile viewports.
- Formatting, linting, strict type checking, tests, and the production build are required quality gates.
