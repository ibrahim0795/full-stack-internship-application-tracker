# Contributing to CareerOrbit

## Workflow

1. Start with a scoped GitHub issue and acceptance criteria.
2. Branch from the latest `main` using `feature/<short-name>` or `fix/<short-name>`.
3. Keep commits focused and use imperative messages such as `Add application status validation`.
4. Run formatting, linting, strict type checking, relevant tests, and a production build.
5. Open a pull request that links the issue, explains the user impact, includes verification evidence, and supplies screenshots for visible changes.
6. Merge only after the acceptance criteria are satisfied.

## Development standards

- Prefer Server Components and add `"use client"` only at a real browser-interaction boundary.
- Validate untrusted data with Zod at the server boundary.
- Authorise private records by both record identity and authenticated user ownership.
- Keep essential content outside the WebGL canvas.
- Include accessible names, visible focus, keyboard interaction, loading states, and error states.
- Do not commit secrets, generated build output, test reports, or local database files.

## Pull-request checklist

- Scope matches the linked issue.
- New behaviour has proportionate tests.
- Desktop and mobile layouts were checked.
- Keyboard and reduced-motion behaviour were considered.
- `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass.
- Documentation and `.env.example` are updated when contracts change.
