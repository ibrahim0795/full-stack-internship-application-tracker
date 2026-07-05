# Delivery roadmap

Each phase uses one focused branch, issue, review, and pull request. A phase starts only after the previous phase is approved and merged.

## Current progress

- Phase 1: complete and merged
- Phase 2: complete and awaiting review
- Phases 3-14: not started

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
| `NEXT_PUBLIC_APP_URL` | Canonical local or deployed application URL | Foundation/deployment    |

Storage and email variables will be added to `.env.example` only when their providers are selected. Real values belong in local or deployment secrets and must never be committed.
