# Duribun Design System

Duribun now uses the visual language from the Modern Cute App Design reference:
bright, playful, mobile-first, photo-led, and icon-heavy. The product should
feel like a modern cute couple archive rather than a quiet premium journal.

## Required Image References

Before creating or changing frontend UI, layout, styling, interaction patterns,
or visual copy, inspect the relevant files under `docs/design-image-files/`.
These images are required design references, not optional inspiration.

- `duribun_design_system.png`: source of truth for brand feeling, color,
  typography, radius, shadow, navigation, badges, empty states, and card
  patterns.
- `duribun_uiux_mockup_01.png`: reference for login, onboarding, profile
  creation, couple connection, invite code, and connection-complete flows.
- `duribun_uiux_mockup_02.png`: reference for our-place home, feed/list
  switching, place registration, place detail, review state, and review writing.
- `duribun_uiux_mockup_03.png`: reference for friend recommendations, friend
  code management, explore, settings, sharing criteria, privacy, and couple
  disconnect flows.

When a UI decision is more specific in these images than in written rules, use
the image as the primary reference while preserving product behavior and privacy
rules from the docs.

## Product Feeling

- Default personality: cute couple place archive 70%, recommendation app 30%.
- Primary emotional cue: cheerful, friendly, quick to scan, and mobile native.
- Visual references: the imported Modern Cute App Design, shadcn-style rounded
  controls, bright app icons, and photo-first mobile feeds.
- Use strong rounded shapes, bold labels, soft shadows, and clear icon states.
- Romantic cliches are allowed only when they serve a real feature. Do not add
  decorative hearts or mascots by default.

## Core Layout Principle

The private app home defaults to a photo-first place feed.

- One couple place is one card.
- Use a two-column photo feed on mobile when space allows.
- Each card must show photo, place name, review state, and public/private state.
- Rating appears as a compact pill when available.
- Users can switch between feed and list view using icon controls.

List layout is for scanning and management:

- Small thumbnail.
- Place name.
- Category and visit date.
- Review status.
- Rating when available.
- Public/private state.

## Color Palette

Use this palette as the default app language.

- Background: `#FFFFFF`
- Surface/Card: `#FFFFFF`
- Primary: `#FF6B9D`
- Primary foreground: `#FFFFFF`
- Secondary: `#FFC75F`
- Text: `#1A1A1A`
- Muted surface: `#F5F5F5`
- Muted text: `#737373`
- Border: `rgba(0, 0, 0, 0.08)`

The UI may use pink-to-yellow gradients for brand text, add buttons, empty
states, and playful emphasis. Avoid making every surface tinted; keep cards
white so photos remain readable.

## Tailwind And SCSS

- Tailwind is allowed and should be used for layout, spacing, typography
  utilities, responsive rules, and common state styles.
- SCSS Modules remain the place for component-owned custom styling, generated
  background behavior, safe-area rules, non-trivial shadows, and reusable design
  token composition.
- Keep reusable tokens in `src/styles/variables.scss`.
- Expose app theme values as CSS custom properties in `src/app/globals.scss`.
- Tailwind theme values are mapped in `src/app/tailwind.css`.
- Do not copy the entire shadcn component kit from reference projects. Install
  or create only components that are actually needed.

## Shape And Shadow

- Use large rounded corners by default.
- Photo cards: `2rem`.
- Panels and list cards: `1.5rem`.
- Small controls: `1.25rem` or pill radius.
- Use soft but visible shadows for cards and floating actions.
- Keep card borders subtle but present.

## Typography

- Prefer system sans-serif.
- Use bold to black weights for app labels, buttons, card titles, tabs, and
  important states.
- Do not use serif display type for the main app.
- Gradient text is allowed for the brand and landing hero only.
- Korean labels must be short enough to fit compact mobile controls.

## Navigation

The primary mobile navigation supports:

- Our places.
- Add place.
- Friend recommendations.
- Explore.
- Settings.

Use a bottom navigation pattern in the protected app. The add-place control is a
center floating circular action with a pink-to-yellow gradient.

## Controls

- Use icons for tabs, view switching, privacy state, rating, and common actions.
- Use segmented icon controls for feed/list switching.
- Use bright primary buttons for main actions.
- Use muted rounded buttons for secondary actions.
- Keep destructive actions restrained but clearly labeled.

## Review And Privacy States

Review and privacy states must be visible on place cards.

- `none`: muted badge.
- `waiting-partner`: light primary badge.
- `partner-waiting`: primary badge.
- `complete`: secondary badge.
- Public state uses a globe icon.
- Private state uses a lock icon.

Sharing eligibility must still follow product rules; the cute visual language
does not relax privacy constraints.

## Photos

- Photos are the main visual material.
- Use large, inspectable images in the feed.
- Feed cards may crop square for a cute mobile grid.
- List rows use stable square thumbnails.
- Empty states should use large gradient icon blocks, not long text walls.

## Do

- Use bright pink and warm yellow as the main identity.
- Use rounded, mobile-native, touch-friendly controls.
- Use photos as the primary content.
- Use icon-first navigation and state display.
- Keep implementation aligned with current Next app structure.

## Do Not

- Do not copy unused shadcn components into the repo.
- Do not introduce MUI or the reference Vite app structure.
- Do not hide privacy and sharing rules behind decorative UI.
- Do not use broken imported Korean strings; rewrite copy in clear Korean.
