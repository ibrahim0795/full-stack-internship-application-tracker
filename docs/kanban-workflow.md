# Kanban workflow

The Kanban board presents all eight application stages as one horizontally scrollable workflow: Saved, Preparing, Applied, Assessment, Interview, Offer, Rejected, and Withdrawn.

## Interaction model

- Pointer users drag a card by its dedicated handle, keeping the card's detail link independently clickable.
- Keyboard users can focus the drag handle and use the drag sensor.
- Every card also includes an explicit stage selector. This is the reliable alternative for keyboard, touch, assistive-technology, and reduced-dexterity users.
- Search and work-arrangement filters update the visible cards and per-column counts immediately.

## Persistence and rollback

The client updates the card immediately, then invokes an owner-scoped server action. The server validates the stage and updates with both application ID and authenticated user ID. A failed or rejected mutation restores the complete previous board state and announces the failure through an alert and live region.

Only one mutation can be pending at a time. This prevents an older failed request from rolling back a newer successful move.

## Responsive behavior

Columns use fixed readable widths in a horizontal, snap-aligned scrolling region. Mobile users can move cards using the stage selector without performing a long drag across off-screen columns. All important application content remains normal HTML rather than a canvas.
