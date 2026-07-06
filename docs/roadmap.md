# Delivery roadmap

Each phase uses one focused branch, issue, review, and pull request. A phase starts only after the previous phase is approved and merged.

## Current progress

- Phase 1: complete and merged
- Phase 2: complete and merged
- Phase 3: complete and merged
- Phase 4: complete and merged
- Phase 5: complete and merged
- Phase 6: complete and merged
- Phase 7: complete and merged
- Phase 8: complete and merged
- Phase 9: complete and awaiting review
- Phases 10-14: not started

| Phase | Branch                              | Deliverable                                                                                                 |
| ----- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1     | `feature/project-foundation`        | Architecture, data-model contract, storyboard, tooling, minimal page, and quality gates.                    |
| 2     | `feature/design-system`             | Tokens, typography, accessible primitives, themes, marketing/app shells, and responsive navigation.         |
| 3     | `feature/3d-landing-page`           | Seven-scene scroll experience, dynamic loading, reduced-motion fallback, and performance instrumentation.   |
| 4     | `feature/authentication`            | Credentials and GitHub login, password hashing, sessions, protected routes, and reset structure.            |
| 5     | `feature/database-schema`           | Prisma schema, migrations, seed data, database client, repositories, and ownership tests.                   |
| 6     | `feature/application-crud`          | Application list/detail/forms, notes, contacts, tags, search, filters, sorting, and deletion.               |
| 7     | `feature/kanban-board`              | Accessible drag-and-drop stages, optimistic updates, rollback, counts, and mobile controls.                 |
| 8     | `feature/dashboard-analytics`       | Real aggregates, charts, recent activity, rates, deadlines, interviews, and next actions.                   |
| 9     | `feature/calendar-reminders`        | Monthly calendar, deadlines, follow-ups, completion, and overdue states.                                    |
| 10    | `feature/interview-preparation`     | Interview records, questions, answers, checklist, outcomes, contacts, and follow-ups.                       |
| 11    | `feature/cv-manager`                | CV metadata, storage abstraction, default selection, application assignment, and usage counts.              |
| 12    | `feature/accessibility-performance` | Keyboard audit, contrast, reduced motion, responsive QA, WebGL fallback, and performance budget.            |
| 13    | `feature/testing`                   | Expanded unit, component, integration, and end-to-end coverage for critical journeys.                       |
| 14    | `feature/deployment`                | Production database, storage, environment configuration, CI, deployment, demo data, and final README media. |

## Phase 4 acceptance criteria

- [x] Email/password registration uses server-side Zod validation and bcrypt hashing.
- [x] Credentials login and logout use Auth.js sessions.
- [x] GitHub OAuth is available only when its credentials are configured.
- [x] Dashboard access is checked in the proxy and again on the server page.
- [x] Duplicate email, unsafe redirect, and account-enumeration risks are handled.
- [x] Single-use password-reset tokens are hashed in PostgreSQL and expire after 30 minutes.
- [x] Authentication attempts have a replaceable rate-limit boundary.
- [x] Login, registration, reset, and protected-route behaviour has automated coverage.

## Phase 5 acceptance criteria

- [x] All private product models, enums, relations, timestamps, and indexes exist in Prisma.
- [x] Composite relationships prevent cross-owner application descendants and tag links.
- [x] PostgreSQL checks enforce salary, currency, position, file-size, tag, and theme rules.
- [x] A partial unique index permits at most one default CV per user.
- [x] The deterministic seed resets only its demo workspace and creates coherent sample data.
- [x] Repository reads and mutations require an authenticated user ID.
- [x] Ownership filters and the migration contract have automated tests.

## Phase 6 acceptance criteria

- [x] Authenticated users can create, view, edit, and confirm-delete applications.
- [x] List search, stage and arrangement filters, and sorting execute on the server.
- [x] Forms use React Hook Form, Zod, accessible labels, and server validation.
- [x] Skills, salary, dates, links, location, arrangement, stage, and CV assignment persist.
- [x] Application details support activity notes and company contacts.
- [x] Every private read and mutation includes the authenticated user ID.
- [x] Empty, loading, not-found, and error states are implemented.
- [x] Validation, ownership filters, list queries, and form errors have automated tests.

## Phase 7 acceptance criteria

- [x] All eight application stages render as counted Kanban columns.
- [x] Pointer and keyboard drag sensors use a dedicated accessible handle.
- [x] Every card provides an explicit stage selector for mobile and non-drag interaction.
- [x] Stage mutations are validated and scoped to the authenticated owner.
- [x] Optimistic moves persist to PostgreSQL and restore the previous state after failure.
- [x] Search and work-arrangement filters update visible cards and counts.
- [x] Horizontal snap scrolling keeps columns readable on small screens.
- [x] Loading, error, live-announcement, and empty-column states are implemented.
- [x] Success, rollback, filtering, and protected-route behavior have automated tests.

## Phase 8 acceptance criteria

- [x] All metrics, charts, lists, and recommendations use owner-scoped database records.
- [x] Total, weekly submissions, deadlines, interviews, interview rate, and offer rate are defined.
- [x] Zero denominators and empty workspaces produce safe, useful states.
- [x] Status and eight-week trend charts have semantic table equivalents.
- [x] Upcoming lists exclude completed applications and canceled interviews.
- [x] Recent applications use real update timestamps.
- [x] Recommended actions prioritize overdue deadlines, interviews, and Saved opportunities.
- [x] Responsive loading, error, and empty states are implemented.
- [x] Dashboard calculations have deterministic automated tests.

## Phase 9 acceptance criteria

- [x] A protected, URL-addressable monthly calendar renders a six-week grid.
- [x] Mobile users receive a readable chronological month list.
- [x] Active deadlines, pending interviews, follow-ups, and reminders share one event model.
- [x] Event grouping and display use the user's configured timezone.
- [x] Users can create, complete, reopen, and delete custom reminders.
- [x] Reminder and related-application mutations are owner-scoped.
- [x] Overdue, upcoming, and completed states are clearly separated.
- [x] The dashboard surfaces incomplete reminders due within thirty days.
- [x] Month parsing, aggregation, timezone behavior, and repository ownership have automated tests.

## Phase 1 acceptance criteria

- [x] Architecture and proposed folder structure are documented.
- [x] Relational model, constraints, cascade behaviour, and ownership rule are documented.
- [x] Seven-scene landing storyboard and fallback strategy are documented.
- [x] Development phases, accounts, and environment variables are identified.
- [x] Next.js App Router, React, strict TypeScript, and Tailwind foundation exists.
- [x] Product, 3D, form, chart, validation, ORM, authentication, and test dependencies are declared.
- [x] Formatting, linting, type-checking, unit-test, end-to-end, and production scripts exist.
- [x] Automated verification passes and the page is visually checked before the phase is committed.

## Required accounts and services

No external account is required to view Phase 1 locally. Later phases require:

- GitHub OAuth application for optional GitHub sign-in.
- Managed PostgreSQL database for preview and production deployments.
- Vercel project (or equivalent Node-compatible host) for public deployment.
- S3-compatible object storage or a managed upload provider for CV files.
- Optional transactional-email provider for password reset and reminders.

Provider selection is deferred until its implementing phase to avoid creating unused accounts or secrets.

## Environment variables

| Variable              | Purpose                                     | Required phase           |
| --------------------- | ------------------------------------------- | ------------------------ |
| `DATABASE_URL`        | PostgreSQL connection string                | Database schema          |
| `AUTH_SECRET`         | Session and token security                  | Authentication           |
| `AUTH_GITHUB_ID`      | GitHub OAuth client identifier              | Authentication, optional |
| `AUTH_GITHUB_SECRET`  | GitHub OAuth client secret                  | Authentication, optional |
| `RESEND_API_KEY`      | Password-reset email API key                | Authentication, optional |
| `AUTH_EMAIL_FROM`     | Verified reset-email sender                 | Authentication, optional |
| `NEXT_PUBLIC_APP_URL` | Canonical local or deployed application URL | Foundation/deployment    |

Storage variables will be added only when their provider is selected. Real values belong in local or deployment secrets and must never be committed.
