# Application management

Phase 6 turns the database foundation into an authenticated application-management workflow.

## Routes

- `/applications` lists the current user's records with server-side search, stage and arrangement filters, and sorting.
- `/applications/new` creates an application through a React Hook Form and Zod-validated server action.
- `/applications/[id]` shows full opportunity context, skills, CV assignment, contacts, and activity notes.
- `/applications/[id]/edit` updates the same validated fields without replacing related history.

## Authorization boundary

Every page obtains the user identifier from the server session. Repository reads combine `id` and `userId`; updates and deletes use `updateMany` or `deleteMany` with the same owner filter. Notes and contacts first verify the parent application belongs to the session user. An inaccessible record therefore behaves exactly like a missing record.

## Persistence behavior

- Application updates and tag replacement happen in one transaction.
- Tags are trimmed, de-duplicated, normalized, and limited to twelve per application.
- CV assignment verifies ownership before writing.
- Salary ranges and currencies are validated by Zod and PostgreSQL constraints.
- Deletion requires browser confirmation and relies on documented database cascades for application-owned records.

## Testing

Unit and component tests cover validation, owner-scoped repository filters, list queries, and client-side form errors. Existing Playwright coverage verifies protected-route behavior on desktop and mobile. Full authenticated CRUD E2E requires the PostgreSQL test service planned for the testing/deployment phases.
