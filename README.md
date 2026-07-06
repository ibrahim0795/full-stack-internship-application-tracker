# CareerOrbit

CareerOrbit is a full-stack internship and junior-job application tracker for students and early-career developers. It is designed to turn a scattered job search into a clear path from saved opportunity to offer.

> **Current status:** All product phases are implemented and production-ready. Public deployment is awaiting managed PostgreSQL and Vercel credentials.

**Live demo:** Pending first production deployment

## Why CareerOrbit

Students often track roles across bookmarks, spreadsheets, calendars, notes, and multiple CV files. CareerOrbit combines that fragmented process into one private workspace with a visible route from Saved to Offer.

## Portfolio highlights

- Owner-scoped authentication and relational PostgreSQL data
- Full application CRUD with notes, contacts, skills, salary, search, filters, and sorting
- Accessible optimistic Kanban workflow with database rollback
- Real dashboard metrics, charts, deadlines, reminders, interviews, and CV usage
- Cinematic 3D landing experience with reduced-motion and constrained-device fallbacks
- Strict TypeScript, layered automated testing, CI, health checks, and release documentation

## Planned product capabilities

- Application tracking with search, filters, notes, contacts, tags, and CV assignment
- Accessible Kanban workflow from Saved through Offer
- Interview preparation, questions, checklists, and follow-up reminders
- Deadline calendar and action-oriented notifications
- CV version management and usage history
- Real application analytics and recommended next actions
- Immersive, scroll-driven 3D marketing journey with a lightweight fallback

## Technology foundation

- Next.js App Router, React, and strict TypeScript
- Tailwind CSS and Framer Motion
- React Three Fiber, Drei, Three.js, and GSAP
- PostgreSQL, Prisma, Auth.js, Zod, and React Hook Form
- Recharts, Vitest, Testing Library, and Playwright

## Architecture and planning

- [Application architecture](docs/architecture.md)
- [3D experience](docs/3d-experience.md)
- [Design system](docs/design-system.md)
- [Authentication architecture](docs/authentication.md)
- [Application management](docs/application-management.md)
- [Kanban workflow](docs/kanban-workflow.md)
- [Dashboard analytics](docs/dashboard-analytics.md)
- [Calendar and reminders](docs/calendar-reminders.md)
- [Interview preparation](docs/interview-preparation.md)
- [CV manager](docs/cv-manager.md)
- [Accessibility and performance](docs/accessibility-performance.md)
- [Testing strategy](docs/testing.md)
- [Production deployment](docs/deployment.md)
- [Relational data model](docs/data-model.md)
- [3D landing storyboard](docs/landing-storyboard.md)
- [Delivery roadmap](docs/roadmap.md)

## Local development

Requirements: Node.js 24 or a current supported LTS release, npm, Git, and PostgreSQL.

```powershell
npm install
Copy-Item .env.example .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Replace the example `AUTH_SECRET` before starting the app. Credentials authentication requires PostgreSQL. GitHub OAuth and password-reset email remain optional; see the [authentication guide](docs/authentication.md).

The optional seed creates a clearly labelled local demo workspace (`demo@careerorbit.dev`) with applications at several stages. Its sample organisations and contacts are fictional and are not presented as CareerOrbit customers.

## Quality checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Authenticated browser journeys require a disposable `E2E_DATABASE_URL`; without it they are skipped explicitly. See the [testing strategy](docs/testing.md).

GitHub Actions runs the full suite with an isolated PostgreSQL service, including authenticated cross-user browser journeys.

## Deployment

The repository includes Vercel configuration, explicit production migration commands, security headers, a database-aware `/api/health` endpoint, CI, rollback guidance, and a release checklist. See the [deployment guide](docs/deployment.md).

## Screenshots and demonstration

Final production screenshots and a short demonstration video will be added after the first public deployment so the README does not present local or fabricated URLs as a live product.

## Environment safety

Use `.env.example` as the variable reference. Never commit `.env`, `.env.local`, database credentials, OAuth secrets, email keys, or storage credentials.

## Accessibility and performance direction

The 3D experience is progressive enhancement. Essential content and controls remain semantic HTML, keyboard accessible, and usable with reduced motion or without WebGL. Asset budgets, dynamic loading, capped pixel density, and paused off-screen rendering are part of the implementation contract.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the issue, branch, verification, and pull-request workflow.

## Licence

Licensed under the [MIT License](LICENSE).
