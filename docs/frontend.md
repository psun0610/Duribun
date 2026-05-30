# Frontend Code Style Rules

## Tech Stack

- React
- TypeScript
- Zustand
- CSS Modules depending on the existing file style

## General

- Follow the existing project structure and naming conventions.
- Prefer small, focused components over large components.
- Do not introduce new libraries unless explicitly requested.
- Do not change unrelated files.
- Keep changes minimal and easy to review.

## TypeScript

- Do not use `any`.
- Prefer explicit types for props, API responses, and store state.
- Use `type` for unions and utility types.
- Use `interface` for object shapes that may be extended.
- Avoid unnecessary type assertions like `as`.
- Prefer `unknown` over `any` when the value type is not known.

## React

- Do not use `React.FC`.
- Use named exports for components and hooks.
- Component names must use PascalCase.
- Hook names must start with `use`.
- Keep business logic out of JSX when possible.
- Extract repeated UI or logic only when it improves readability.
- Avoid unnecessary `useMemo` and `useCallback`.
- Always adhere to ES6 syntax.
- Use arrow functions instead of the `function` keyword.

## State Management

- Use local state for UI-only state.
- Use Zustand only when state is shared across components.
- Do not store derived state if it can be computed from existing state.
- Keep server data separate from client UI state.
- Do not mutate store state directly.

## Styling

- Follow `docs/design-system.md` for Duribun's product visual language.
- Write frontend styles in SCSS.
- Use nested SCSS selectors where they clarify ownership, keeping nesting shallow.
- Store reusable styling variables in `src/styles/variables.scss`.
- Design mobile-first and account for responsive behavior before desktop polish.
- Account for cross-browser behavior, especially iOS Safari.
- Follow the styling approach already used in the target file.
- Avoid inline styles unless the value is dynamic.
- Use semantic class names when CSS Modules are used.
- Keep layout styles close to the component that owns the layout.
- Avoid hard-coded magic numbers unless they match the design system.

## API / Async

- Define request and response types.
- Handle loading, empty, and error states.
- Avoid duplicate API calls.
- Keep API functions separate from UI components.
- Do not silently swallow errors.

## Naming

- Use clear, domain-based names.
- Avoid vague names like `data`, `item`, `temp`, `info` unless the scope is very small.
- Boolean names should start with `is`, `has`, `can`, or `should`.
- Event handlers should start with `handle`.

## File Structure

- One main component per file.
- Co-locate small helper functions if they are only used in one file.
- Move shared utilities to a common utility folder.
- Keep barrel exports consistent with the existing project.

## Before Commit

- Run lint.
- Run type check.
- Run tests if related code has tests.
- Do not commit console logs, commented-out code, or temporary code.

## Review Priorities

When modifying code, prioritize in this order:

1. Correctness
2. Type safety
3. Readability
4. Consistency with existing code
5. Minimal diff
