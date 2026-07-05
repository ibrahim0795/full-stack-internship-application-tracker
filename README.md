# CareerOrbit

CareerOrbit is a full-stack internship and junior-job application tracker for students and early-career developers. It is designed to turn a scattered job search into a clear path from saved opportunity to offer.

> **Current status:** Phase 5 adds the complete relational PostgreSQL model, ownership-safe repositories, integrity constraints, migrations, and a coherent demo seed. Application interfaces follow in focused, reviewable branches.

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

## Environment safety

Use `.env.example` as the variable reference. Never commit `.env`, `.env.local`, database credentials, OAuth secrets, email keys, or storage credentials.

## Accessibility and performance direction

The 3D experience is progressive enhancement. Essential content and controls remain semantic HTML, keyboard accessible, and usable with reduced motion or without WebGL. Asset budgets, dynamic loading, capped pixel density, and paused off-screen rendering are part of the implementation contract.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the issue, branch, verification, and pull-request workflow.

## Licence

Licensed under the [MIT License](LICENSE).
