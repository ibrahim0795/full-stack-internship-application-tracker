# Immersive 3D experience

## Implementation overview

CareerOrbit's landing journey uses one dynamically loaded React Three Fiber canvas pinned behind seven semantic HTML chapters. GSAP ScrollTrigger converts the journey's scroll range into a normalised progress value. The Three.js scene reads that value during its render loop to coordinate camera travel, object transitions, and chapter composition.

The WebGL layer is decorative and `aria-hidden`. Headings, narrative text, feature names, workflow stages, preview values, navigation, and calls to action remain normal HTML.

## Procedural scene

No external models or textures are required. The scene creates these elements from lightweight geometry:

- Career satellite with illuminated core, orbital rings, antenna, and solar panels
- Opportunity cards that begin scattered and settle into organised paths
- Five feature stations for applications, analytics, deadlines, interviews, and CVs
- Five-node workflow route from Saved to Offer
- Holographic dashboard panel with illustrative metric geometry
- Destination portal made from emissive orbital rings
- Instanced star field, fog, directional light, point lights, and depth

The world shifts between the open left, right, or centre of each chapter so the 3D subject supports rather than obscures the HTML composition.

## Scroll and pointer behaviour

- ScrollTrigger updates a mutable progress reference without causing React renders on every scroll event.
- React Three Fiber reads progress inside `useFrame` and damps camera/object movement for continuous transitions.
- Camera position follows a Catmull-Rom curve through the seven-scene journey.
- Pointer position adds a small camera offset; it never captures essential interaction.
- Each scene element scales in and out across overlapping progress ranges instead of appearing as an unrelated cut.

## Accessibility and fallback hierarchy

The static experience is used when any of these conditions apply:

1. `prefers-reduced-motion: reduce` is active.
2. The user selects **Reduce motion**.
3. WebGL is unavailable or reports a major performance caveat.
4. The device reports two or fewer logical processors or 2 GB or less device memory.
5. A runtime error reaches the scene error boundary.

The user preference is persisted locally. A system reduced-motion preference cannot be overridden from the page. The fallback preserves the same seven HTML chapters and uses a layered static orbit composition.

## Performance controls

- Canvas code is split from the initial server-rendered HTML through a dynamic import.
- Desktop DPR is capped between 1 and 1.5; mobile DPR is fixed at 1.
- Mobile renders fewer opportunity nodes and stars, disables antialiasing, and avoids shadows.
- Procedural geometry avoids model and texture download weight.
- Rendering switches to `frameloop="never"` when the journey is outside an expanded viewport boundary or the document is hidden.
- Device-width changes update compact/full scene complexity without a reload.
- Mutable vectors are reused inside animation frames to avoid repeated allocations.

## Verification contract

- Unit rendering verifies all seven chapters exist without WebGL.
- End-to-end tests verify seven chapters, desktop/mobile overflow, navigation, and persistent reduced motion.
- WebGL QA verifies one visible canvas, clean console output, hero/workflow/destination states, and compact mobile rendering.
- Reduced-motion QA verifies the full static journey at desktop and mobile widths.
