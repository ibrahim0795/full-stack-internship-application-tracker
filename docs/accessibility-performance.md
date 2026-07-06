# Accessibility and performance

CareerOrbit keeps essential information and controls in semantic HTML. The 3D canvas is decorative and may be removed without changing the product's meaning or workflows.

## Accessibility safeguards

- Marketing and application shells provide skip links to a focusable main landmark.
- Navigation identifies the active page with `aria-current` and all controls have visible keyboard focus.
- Forms retain native labels, descriptions, validation messages, and semantic controls.
- Kanban movement has explicit non-drag controls and live status announcements.
- Charts include semantic table equivalents.
- Loading, empty, error, and confirmation states use readable HTML rather than WebGL.
- System and manual reduced-motion preferences disable non-essential transitions and replace the 3D scene with the static fallback.

## 3D performance strategy

- The canvas is client-only and dynamically loaded behind a lightweight loading state.
- WebGL is skipped when unavailable, on devices with at most 2 GB memory or 2 CPU cores, on 2G connections, or when data saver is active.
- Mobile and constrained rendering reduces stars, shadows, antialiasing, and device pixel ratio.
- Desktop device pixel ratio is capped at 1.5; compact mode is capped at 1.
- Rendering pauses when the journey leaves the viewport or the document is hidden.
- React Three Fiber may lower render quality during sustained performance pressure.
- Repeated stars use Drei's buffer-based implementation rather than separate DOM or mesh nodes.

## Performance budgets

Production review targets are:

| Measure                       | Target                                          |
| ----------------------------- | ----------------------------------------------- |
| Largest Contentful Paint      | 2.5 seconds or less at the 75th percentile      |
| Interaction to Next Paint     | 200 milliseconds or less at the 75th percentile |
| Cumulative Layout Shift       | 0.1 or less                                     |
| Initial 3D device pixel ratio | 1.5 maximum                                     |
| Horizontal page overflow      | None at 375, 768, 1024, and 1440 pixels         |

Real-user Core Web Vitals monitoring is a deployment concern because local synthetic results cannot represent production networks and devices honestly.

## Manual QA checklist

1. Navigate each public and protected route using only Tab, Shift+Tab, Enter, Space, arrow keys, and Escape where applicable.
2. Confirm skip links become visible on focus and move focus to main content.
3. Check labels, errors, status changes, dialogs, tables, and headings with a screen reader.
4. Enable operating-system reduced motion and the in-product motion control independently.
5. Verify zoom at 200% and test widths of 375, 768, 1024, and 1440 pixels.
6. Emulate data saver, 2G, and WebGL failure and confirm the static experience preserves all content.
