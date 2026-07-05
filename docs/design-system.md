# CareerOrbit design system

## Direction

CareerOrbit combines an editorial product interface with restrained space imagery. The visual system should feel ambitious and technically capable without becoming a game interface. Glow, transparency, and orbital geometry are accents; hierarchy, contrast, and clear next actions do the real work.

## Semantic tokens

Theme values live in `src/app/globals.css` and are exposed to Tailwind through semantic names. Components consume purpose-based tokens such as `background`, `surface`, `foreground`, `muted`, `border`, `primary`, `accent`, `success`, and `danger` rather than fixed palette utilities.

This allows dark and light themes to preserve meaning while using different values:

- **Background:** page canvas
- **Surface / surface-raised:** panels and elevated controls
- **Field:** form-control background
- **Foreground / muted:** primary and supporting text
- **Border / border-strong:** quiet and emphasized separation
- **Primary:** main action and career-orbit identity
- **Accent:** secondary emphasis and 3D narrative moments
- **Success / danger:** status meaning, never decoration alone
- **Focus:** keyboard focus outline

## Typography

Geist Sans is the interface and display family; Geist Mono is reserved for compact technical values when needed. Headings use tight tracking and a compact line height, while body copy uses relaxed line height for readability. Minimum body text remains 14 pixels, with 16-20 pixels preferred for narrative content.

## Shape and elevation

- Buttons are pill-shaped to suggest motion and orbital paths.
- Form controls use 16-pixel-equivalent rounded corners.
- Product and marketing cards use larger 24-32-pixel-equivalent corners.
- Borders establish hierarchy before shadows.
- Glow is reserved for primary actions, orbit diagrams, and major destinations.

## Core components

- `BrandMark`: accessible home link and responsive compact variant
- `Button` / `buttonVariants`: primary, secondary, ghost, and size variants
- `Badge`: cyan, violet, neutral, and semantic-success tones
- `Card`: reusable surface with header and content regions
- `FormField`, `Input`, `Textarea`, `Select`: labelled form foundation with help/error patterns
- `ThemeProvider` / `ThemeToggle`: system-aware, persisted light/dark preference
- `MarketingHeader`: desktop navigation and accessible mobile disclosure
- `MarketingShell`: skip link, header, content, and footer composition
- `AppShell`: future protected-product layout with ownership of navigation and page title

## Accessibility contract

- Interactive controls have a minimum 44-pixel target in normal usage.
- Focus uses a visible semantic outline and offset.
- Colour is not the only carrier of meaning.
- Mobile navigation exposes `aria-expanded` and a labelled controlled region.
- Form labels remain visible; descriptions and errors use stable IDs.
- Reduced motion disables smooth scrolling and collapses animation duration.
- Essential information remains HTML and never depends on WebGL.

## Usage rules

1. Use an existing semantic token before adding a new value.
2. Use an existing primitive before creating one-off button, badge, field, or card styles.
3. Add a component variant only when the same distinction appears in more than one real workflow.
4. Test visible components in dark and light themes, keyboard navigation, and small/mobile widths.
5. Do not add fake statistics, decorative dead buttons, or inaccessible hover-only information.
