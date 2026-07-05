# Relational data model

This is the Phase 1 design contract. The executable Prisma schema and migrations belong to the database-schema phase.

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
