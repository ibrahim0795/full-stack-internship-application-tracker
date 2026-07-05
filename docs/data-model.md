# Relational data model

This contract is implemented by `prisma/schema.prisma` and the versioned migrations in `prisma/migrations`. PostgreSQL is the source of truth; CV files themselves belong in object storage rather than database rows.

## Core relationships

```text
User 1--* Application 1--* ApplicationNote
User 1--* Application 1--* CompanyContact
User 1--* Application 1--* Interview 1--* InterviewQuestion
User 1--* Interview 1--* ChecklistItem
User 1--* Resume 1--* Application
User 1--* Reminder
Application *--* Tag (through ApplicationTag)
User 1--* Account
User 1--* Session
```

## Model responsibilities

| Model               | Important data                                                                                                               | Ownership and constraints                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `User`              | name, email, password hash, image, preferences, timestamps                                                                   | Email is unique; password hash is nullable for OAuth-only users.                         |
| `Account`           | provider identity and OAuth tokens                                                                                           | Unique provider/provider-account pair; cascades with user deletion.                      |
| `Session`           | session token and expiry                                                                                                     | Token is unique; cascades with user deletion.                                            |
| `Application`       | company, role, description, URL, employment/work type, location, salary range, currency, stage, key dates, notes, timestamps | Belongs to one user; indexed by user/stage, user/deadline, and user/updated date.        |
| `CompanyContact`    | name, email, role, phone, profile URL                                                                                        | Belongs to an application; access is authorised through the application owner.           |
| `ApplicationNote`   | note body and timestamps                                                                                                     | Belongs to an application; deleted with its application.                                 |
| `Interview`         | format, scheduled time, timezone, location/link, interviewer, outcome, follow-up date, notes                                 | Belongs to an application and owner; indexed by user/scheduled time.                     |
| `InterviewQuestion` | prompt, answer, category, position, timestamps                                                                               | Belongs to an interview; stable position supports manual ordering.                       |
| `ChecklistItem`     | label, completion state/time, position                                                                                       | Belongs to an interview and is deleted with it.                                          |
| `Resume`            | display name, target role, storage key or URL, original filename, MIME type, size, default flag                              | Belongs to one user; only one default resume per user is enforced transactionally.       |
| `Reminder`          | type, title, due time, completion time, related entity references                                                            | Belongs to one user; indexed by user/due time and user/completion state.                 |
| `Tag`               | normalised name, display name, colour                                                                                        | User-owned to prevent cross-account data exposure; unique per user and normalised name.  |
| `ApplicationTag`    | application ID and tag ID                                                                                                    | Composite primary key prevents duplicates; service verifies both records share an owner. |

## Enumerations

- `ApplicationStage`: `SAVED`, `PREPARING`, `APPLIED`, `ASSESSMENT`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`
- `EmploymentType`: `INTERNSHIP`, `PART_TIME`, `FULL_TIME`, `CONTRACT`, `FREELANCE`, `OTHER`
- `WorkArrangement`: `REMOTE`, `HYBRID`, `ON_SITE`, `UNSPECIFIED`
- `InterviewFormat`: `PHONE`, `VIDEO`, `ON_SITE`, `TAKE_HOME`, `LIVE_CODING`, `OTHER`
- `InterviewOutcome`: `PENDING`, `PASSED`, `FAILED`, `CANCELLED`
- `ReminderType`: `DEADLINE`, `INTERVIEW`, `FOLLOW_UP`, `CUSTOM`

## Data integrity rules

- Salary values are non-negative and minimum cannot exceed maximum.
- Currency uses a three-letter ISO-style code when salary exists.
- Date fields are stored in UTC; user timezone is stored in preferences and used for display.
- Application URLs and CV URLs are validated before persistence.
- Deleting a user cascades through private product data after an explicit confirmation workflow.
- Deleting an application cascades to notes, contacts, interviews, checklist descendants, and tag links; reusable resumes and tags remain.
- File records store metadata and a storage key. PostgreSQL does not store raw CV files.

## Ownership rule

No repository method fetches a private record by ID alone. It must scope through `userId`, either as a direct column or through a parent join. This rule applies to reads, updates, deletes, drag-and-drop stage changes, analytics, exports, and file access.

The schema reinforces this rule with composite `(id, user_id)` references for assigned CVs, application descendants, interviews, reminders, and application-tag links. An assigned CV is restricted from deletion until the CV service unassigns it transactionally. The application repository uses `findFirst`, `updateMany`, and `deleteMany` with both identifiers so an unknown record and another user's record produce the same result.

## Database-enforced constraints

The product-data migration adds constraints Prisma cannot fully express:

- Salary values cannot be negative, and a minimum cannot exceed its maximum.
- Salary rows require a three-letter uppercase currency.
- Question and checklist positions cannot be negative.
- CV file size metadata cannot be negative.
- Each user can have at most one default CV through a partial unique index.
- Theme values are limited to `light`, `dark`, or `system`.
- Tag normalized names must be trimmed, lowercase, non-empty, and unique per user.

## Seed workspace

`npm run db:seed` resets only the clearly labelled demo user's product records, then creates three applications, a CV record, skill tags, an interview checklist, a preparation question, a contact, a note, and a reminder. It never modifies another user's data.
