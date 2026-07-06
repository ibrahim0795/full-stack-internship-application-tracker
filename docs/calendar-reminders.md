# Calendar and reminders

CareerOrbit combines application deadlines, pending interviews, interview follow-ups, and user-created reminders into one chronological event model.

## Calendar behavior

- Month URLs use validated `YYYY-MM` query values, so calendar views are bookmarkable and shareable within the authenticated account.
- Desktop renders a six-week semantic month grid; smaller screens receive a chronological event list instead of compressed cells.
- Events are grouped and formatted using the user's stored IANA timezone.
- Deadlines from Offer, Rejected, and Withdrawn applications and canceled interviews are excluded.

## Reminder workflow

Users can create a custom reminder, optionally connect it to an owned application, mark it complete, reopen it, or delete it. The browser converts device-local input to an ISO instant before the server action stores it as UTC.

Every mutation combines the reminder ID with the authenticated user ID. Related application selection is also ownership-checked before creation.

## Event states

- Overdue events are incomplete events before the current instant.
- Upcoming events are incomplete events within thirty days.
- Completed custom reminders remain visible in a separate history list and appear struck through in the month view.
- Dashboard reminders include incomplete items due within thirty days, including overdue reminders.

External notification delivery is not implied. Email or push delivery requires a configured provider in a later deployment phase.
