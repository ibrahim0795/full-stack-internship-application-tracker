# Dashboard analytics

CareerOrbit's dashboard is calculated from the authenticated user's PostgreSQL records. It contains no placeholder totals or fabricated performance data.

## Metrics

- **Total applications:** every application owned by the user.
- **Submitted this week:** submitted applications whose application date, or creation date fallback, falls within the current seven-day UTC window.
- **Upcoming deadlines:** active applications closing within fourteen days.
- **Upcoming interviews:** pending interview records scheduled within fourteen days.
- **Interview rate:** submitted applications with an interview record or an Interview/Offer stage, divided by submitted applications.
- **Offer rate:** Offer-stage applications divided by submitted applications.

Saved and Preparing records are excluded from conversion-rate denominators. Zero submitted applications produce a safe `0%`, never an invalid number.

## Visualizations and lists

- The status bar chart includes every application stage, including zero-count stages.
- The trend chart groups applications into eight weekly UTC windows.
- Both charts have semantic table equivalents for users who cannot perceive or operate the visual chart.
- Deadlines prioritize recent overdue items and then upcoming dates.
- Recently updated applications are ordered by their database timestamp.

## Recommended actions

Recommendations are deterministic rather than AI-generated. Overdue deadlines and upcoming interviews are prioritized, followed by Saved opportunities that need a decision. An empty workspace recommends creating the first application.

## Ownership

The dashboard repository requires `userId` and applies it directly to the application query. Interviews are loaded only as descendants of those owned applications. Calculations receive no cross-account records.
