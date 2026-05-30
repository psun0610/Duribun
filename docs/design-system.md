# Duribun Design System

Duribun is a private shared memory archive for couples. It should feel like a
beautiful shared photo journal built by two people over time, not like a cute
pink dating app.

## Product Feeling

- Default personality: private photo journal 70%, place recommendation service 30%.
- Primary emotional cue: calm, premium, personal, and accumulated over time.
- Visual references: modern iOS native apps, Apple Journal, and Apple Photos.
- The app should feel warm, but never childish.
- Avoid romantic cliches. Do not use hearts, bright pink UI, kawaii illustration,
  couple mascots, or decorative romance motifs as default design language.

## Core Layout Principle

The home screen defaults to a photo-first feed.

- One couple place is one card.
- The main card subject is the place memory, not an individual photo.
- Large photos lead the layout.
- Place name, date, review state, rating, and visibility state support the photo.
- Users should be able to switch between photo feed and list layout.
- The layout switch should be an icon control, not explanatory text.

Use list layout for scanning and management:

- Small thumbnail.
- Place name.
- Category.
- Review status.
- Rating or completion state.
- Privacy/public state.

## Color Palette

Use this palette as the default app language.

- Background: `#FFFDFD`
- Surface: `#FFFFFF`
- Primary: `#A8B9D8`
- Accent: `#F5D8DE`
- Secondary: `#B8C8B4`
- Text: `#2E2E2E`

Supporting colors should stay soft, low-saturation, and close to iOS native
surfaces. Do not introduce loud pinks, saturated purples, heavy gradients, or
dark-mode-first palettes without an explicit product reason.

## SCSS Rules

- Write styles in SCSS, not plain CSS.
- Use nested selectors when they express component ownership clearly.
- Keep nesting shallow. Do not nest more than three levels deep.
- Store reusable design tokens in `src/styles/variables.scss`.
- Do not define reusable colors, spacing, radii, shadows, or breakpoints inside
  component files when they belong to the design system.
- Import variables with `@use`.
- Prefer CSS custom properties for runtime theme values exposed to the browser.
- Prefer SCSS variables for build-time tokens, maps, and breakpoints.
- Keep selector names semantic and product-oriented.
- Avoid global selectors except reset, app shell, and documented shared utility
  classes.

## Responsive Rules

- Design mobile-first.
- Every screen must work at narrow mobile widths before adding desktop layout.
- Use shared breakpoint variables from `src/styles/variables.scss`.
- Avoid viewport-scaled text. Use fixed or `clamp()` sizes with stable min and
  max values.
- Make fixed-format UI such as cards, controls, tabs, and media areas stable
  with `min-height`, `aspect-ratio`, or explicit layout constraints.
- Verify that Korean and English labels fit in buttons and compact controls.

## Cross-Browser Rules

- Use standards-based CSS first.
- Add fallback values before newer features when browser support is uneven.
- Avoid relying on `backdrop-filter`, `:has()`, container queries, or advanced
  color functions unless the UI still works without them.
- Include `-webkit-` prefixed properties only when they are needed for current
  Safari/iOS behavior.
- Keep focus states visible with `:focus-visible`.
- Do not hide essential content behind hover-only interactions.

## Surfaces

- Prefer white surfaces over tinted cards.
- Use subtle borders before shadows.
- Shadows must be very soft and shallow.
- Rounded corners should generally be `20px` to `24px` for photo cards and large
  surfaces.
- Smaller controls may use `12px` to `16px` radius.
- Do not nest cards inside cards.

## Spacing

- Use airy spacing.
- Leave room around photos and primary text.
- Avoid dense dashboards on memory-first screens.
- Use denser list rows only in explicit management or list modes.
- Keep touch targets comfortable for mobile use.

## Photos

Photos are the primary visual material.

- Use large, inspectable photos.
- Avoid dark overlays unless text readability requires a subtle gradient.
- Do not crop so aggressively that the place cannot be understood.
- Public/shareable `place_food` photos and private `couple_private` photos must
  be visually distinguishable in UI states.
- Empty states should reserve space for future photos instead of becoming text
  walls.

## Typography

- Use elegant, readable typography.
- Prefer an iOS-native feeling: clear hierarchy, quiet labels, generous line
  height.
- Do not make the app feel like a marketing landing page.
- Use large type sparingly for page titles or memory moments.
- Use compact, readable type for metadata such as category, review state,
  privacy, and dates.

## Navigation

Primary mobile navigation should support these product areas:

- Our places.
- Add place.
- Friend recommendations.
- Explore.
- Settings.

The home entry should prioritize "our places" as the private memory archive.
Friend recommendations and explore are secondary surfaces and may use more
information density than the private home feed.

## Controls

- Use icon controls for view switching, filtering, sorting, and common actions.
- Use segmented controls for feed/list view switching when space allows.
- Use menus for secondary filtering and sorting.
- Use clear text buttons only for primary actions such as starting login,
  saving, adding, or confirming destructive flows.
- Keep destructive actions visually restrained but unmistakable.

## Review And Privacy States

The UI must make review completion and visibility clear without making the app
feel procedural.

- Review state should be visible on place cards.
- Public/private state should be visible but quiet.
- Sharing eligibility should never look enabled until both reviews and required
  public photo conditions are satisfied.
- Private notes, individual ratings, and couple-private photos should visually
  remain inside the couple space.

## Do

- Make photos the first visual anchor.
- Use calm pastel blue-gray, blossom pink, and muted sage as accents.
- Keep the app premium, spacious, and native-feeling.
- Let emotional warmth come from saved memories, not decorative romance symbols.
- Give users a clear feed/list layout switch.

## Do Not

- Do not make a bright pink dating app.
- Do not use hearts everywhere.
- Do not use kawaii illustrations or mascots.
- Do not use heavy gradients, excessive shadows, or glossy decoration.
- Do not turn private memory screens into analytics dashboards.
- Do not hide privacy or sharing states behind purely decorative UI.
