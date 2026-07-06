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
- Phase 9: complete and merged
- Phase 10: complete and merged
- Phase 11: complete and merged
- Phase 12: complete and merged
- Phase 13: complete and merged
- Phase 14: release readiness complete; public deployment awaiting provider credentials

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

## Phase 10 acceptance criteria

- [x] Users can create, view, edit, and delete interviews linked to owned applications.
- [x] Interview records include schedule, timezone, format, location/link, interviewer, notes, outcome, and follow-up.
- [x] Date-time fields round-trip through UTC with timezone and daylight-saving support.
- [x] Users can add, edit, answer, categorize, and delete preparation questions.
- [x] Checklist items can be added, completed, reopened, and deleted.
- [x] Persisted checklist and answer progress appears in interview lists and details.
- [x] Pending interviews and follow-ups integrate with dashboard and calendar data.
- [x] Interview, question, and checklist operations enforce owner scope.
- [x] Responsive loading, empty, history, not-found, and error states are implemented.

## Phase 11 acceptance criteria

- [x] Users can create and edit named CV versions with target-role and file metadata.
- [x] External URLs are represented honestly and managed uploads remain behind a storage abstraction.
- [x] The first CV becomes default and default changes are transactional.
- [x] CV lists show real application usage counts and links.
- [x] Assigned CVs cannot be deleted until their applications are reassigned.
- [x] Deleting a default selects a replacement in the same transaction.
- [x] All CV reads and mutations enforce authenticated ownership.
- [x] Responsive loading, empty, not-found, and error states are implemented.
- [x] Validation, storage resolution, ownership, and protected-route behavior have automated tests.

## Phase 12 acceptance criteria

- [x] Public and protected shells provide keyboard-accessible skip navigation and main landmarks.
- [x] Important controls retain visible focus, semantic names, and non-pointer alternatives.
- [x] System and manual reduced-motion preferences preserve all information with a static fallback.
- [x] WebGL capability, hardware limits, data saver, and slow connections select an appropriate experience.
- [x] Canvas pixel ratio and visual complexity are capped for compact devices.
- [x] Rendering pauses when the experience is offscreen or the document is hidden.
- [x] Responsive tests cover 375, 768, 1024, and 1440 pixel widths without page overflow.
- [x] Accessibility, performance budgets, fallback behavior, and manual QA are documented.

## Phase 13 acceptance criteria

- [x] Shared deterministic factories reduce duplicated fixtures and wall-clock dependence.
- [x] Application, interview, and CV validation have focused component coverage.
- [x] Dashboard edge cases and device-capability branches have deterministic unit coverage.
- [x] Owner-scoped repository contracts verify private list and detail filters.
- [x] Public browser tests cover protected routes, keyboard focus, motion, and target widths.
- [x] Authenticated browser journeys cover registration, CRUD, filtering, stage movement, and deletion.
- [x] A real second-user journey verifies that private application details cannot be read cross-owner.
- [x] Database-dependent tests skip clearly unless a disposable `E2E_DATABASE_URL` is configured.
- [x] Local and CI test layers, commands, isolation rules, and database safety are documented.

## Phase 14 acceptance criteria

- [x] GitHub Actions runs formatting, linting, types, unit tests, a production build, and authenticated browser journeys with PostgreSQL.
- [x] Production database migrations use an explicit repeatable command.
- [x] A database-aware health endpoint returns safe readiness responses without error details.
- [x] Production security headers and canonical metadata are configured.
- [x] Environment, migration, demo-data, smoke-test, monitoring, and rollback procedures are documented.
- [x] The README gives recruiters a concise problem statement, feature overview, architecture links, and honest release status.
- [ ] Managed PostgreSQL and Vercel credentials are configured and the public deployment is verified.

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
