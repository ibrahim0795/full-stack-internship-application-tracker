# 3D landing-page scroll storyboard

> Implementation status: completed in Phase 3. See [3d-experience.md](3d-experience.md) for runtime and fallback details.

The landing page is a single visual journey with seven semantic HTML chapters. One pinned 3D scene responds to normalised scroll progress while each chapter supplies accessible copy and navigation.

| Scene             | Scroll range | Camera and 3D action                                                                                 | HTML narrative                                                              |
| ----------------- | ------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Hero              | 0-14%        | Begin in deep space, pass a sparse star field, and approach a restrained CareerOrbit satellite mark. | Product name, tagline, short value statement, and primary account CTA.      |
| Problem           | 14-28%       | Application cards drift on conflicting paths with gentle depth and parallax.                         | Explain scattered spreadsheets, missed deadlines, and uncertain follow-ups. |
| Solution          | 28-42%       | Cards settle into a clean orbital system around a career hub.                                        | Introduce one organised workflow and ownership of the job search.           |
| Features          | 42-62%       | Camera visits five stations for tracking, analytics, reminders, interviews, and CVs.                 | Short, scannable feature explanations remain readable without the Canvas.   |
| Workflow          | 62-76%       | A glowing route connects Saved, Applied, Assessment, Interview, and Offer markers.                   | Describe the repeatable application lifecycle and next-action guidance.     |
| Dashboard preview | 76-90%       | The orbital interface flattens into a framed product surface; 3D becomes supporting ambience.        | Show a truthful dashboard preview with clearly labelled sample data.        |
| Destination       | 90-100%      | Camera arrives at a bright but restrained destination; particles slow and the orbit resolves.        | “Start your career journey” CTA with login and registration paths.          |

## Interaction rules

- GSAP ScrollTrigger owns the page-to-progress mapping; React Three Fiber consumes progress without rebuilding the scene.
- Pointer movement adds a small camera offset and never blocks scrolling or clicking.
- Focus order follows the HTML document, not visual 3D coordinates.
- Scene transitions overlap slightly so the journey feels continuous.
- Animation cannot be required to understand features or use navigation.

## Performance budget

- Dynamically import the Canvas after the hero HTML is available.
- Target no more than 1.5 MB compressed initial 3D assets and avoid large uncompressed textures.
- Use instancing for stars and repeated particles.
- Cap device pixel ratio at 1.5 on capable desktops and 1 on constrained/mobile devices.
- Pause or reduce rendering while the tab or Canvas is not visible.
- Prefer generated geometry and compressed GLTF/texture assets.
- Monitor Core Web Vitals and keep the HTML content independently renderable.

## Fallback strategy

`prefers-reduced-motion`, a user-controlled Reduce motion setting, WebGL failure, or a constrained device produces a static layered-space treatment. Content order and calls to action remain identical. Reduced motion avoids scroll locking, camera travel, particle motion, and parallax.
