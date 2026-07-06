# Interview preparation

CareerOrbit connects interview logistics and preparation directly to an owned application.

## Workflow

- Create or edit an interview with date, configured timezone, format, location or meeting link, interviewer details, outcome, notes, and follow-up time.
- Add preparation questions, categories, and draft answers; revise or delete them as preparation develops.
- Build an ordered checklist and complete, reopen, or remove individual tasks.
- Record an outcome without removing the preparation history.

Pending interview dates appear in the dashboard and calendar. Follow-up dates become calendar events automatically, so the feature does not create duplicate standalone data.

## Date handling

Date-time fields are shown in the interview's IANA timezone. Wall times are converted to UTC before server actions and formatted back into that timezone on later edits. The conversion helper accounts for timezone offsets and daylight-saving changes.

## Ownership

Interview creation first verifies the selected application belongs to the authenticated user. Interview reads and updates combine interview ID and user ID. Question and checklist mutations scope through their interview and its user ID, making another account's child-record IDs unusable.

## Progress

Checklist completion is calculated from persisted completion timestamps. Question counts distinguish drafted answers from unanswered prompts. Interview history retains passed, failed, and canceled records for later review.
