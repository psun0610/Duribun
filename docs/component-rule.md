# Component Writing Rules

## Directory Separation

Component-related code must be separated by responsibility.

- Shared UI primitives live under `src/components/ui/`.
- App shell and cross-domain layout components may remain under
  `src/components/`.
- Domain-owned UI lives under `src/features/{domain}/components/`.
- Do not place new domain UI directly under `src/components/`.

```txt
ComponentName/
├─ ComponentName.tsx
├─ ComponentName.module.scss
├─ types/
│  └─ componentName.types.ts
├─ const/
│  └─ componentName.const.ts
├─ utils/
│  └─ componentName.utils.ts
├─ hooks/
│  └─ useComponentName.ts
└─ index.ts
```

## Component Rules

- Components must only contain rendering logic and simple event binding.
- Do not define complex types inside `.tsx` files.
- Do not define constants inside `.tsx` files unless they are trivial and used only once.
- Do not define reusable utility functions inside `.tsx` files.
- Do not place API calls directly inside components.
- Keep JSX readable and avoid deeply nested conditional rendering.
- Split large components into smaller components when JSX becomes hard to scan.

## Types Rules

- All component props, API response types, store types, and reusable object shapes must be placed in `types/`.
- Type files must use the `.types.ts` suffix.
- Props types should be named with the component name.

```ts
export interface ComponentNameProps {
    title: string;
    isOpen: boolean;
}
```

- Do not export unused types.
- Do not use `any`.
- Use `unknown` instead of `any` when the value type is unclear.

## Constants Rules

- All fixed values, option lists, labels, status maps, and config-like values must be placed in `const/`.
- Constant files must use the `.const.ts` suffix.
- Constants must use `UPPER_SNAKE_CASE`.

```ts
export const DEFAULT_VISIBLE_COUNT = 5;
export const TAB_OPTIONS = ['home', 'profile'] as const;
```

- Do not hard-code repeated strings, numbers, or option arrays inside components.

## Utils Rules

- Pure functions must be placed in `utils/`.
- Utility files must use the `.utils.ts` suffix.
- Utils must not depend on React hooks, browser state, or component state.
- Utils should receive all required values through parameters.
- Do not place side effects inside utils.

```ts
export const formatCount = (count: number) => {
    return count.toLocaleString();
};
```

## Hooks Rules

- Component-specific stateful logic must be placed in `hooks/`.
- Hook files must start with `use`.
- Hooks may use React hooks, Zustand, Recoil, router hooks, and query hooks.
- Hooks should return values and handlers needed by the component.
- Do not return unnecessary internal implementation details.

```ts
export const useComponentName = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    return {
        isOpen,
        handleOpen,
    };
};
```

## Import Rules

- Import order must be:
    1. External libraries
    2. Shared modules
    3. Feature modules
    4. Local types
    5. Local constants
    6. Local utils
    7. Local hooks
    8. Styles

```ts
import { useState } from 'react';

import { Button } from '@/shared/components';

import type { ComponentNameProps } from './types/componentName.types';
import { DEFAULT_VISIBLE_COUNT } from './const/componentName.const';
import { formatCount } from './utils/componentName.utils';
import { useComponentName } from './hooks/useComponentName';

import styles from './ComponentName.module.scss';
```

## Naming Rules

- Component files must use PascalCase.
- Component names must use PascalCase.
- Hook names must start with `use`.
- Type files must use camelCase with `.types.ts`.
- Constant files must use camelCase with `.const.ts`.
- Utility files must use camelCase with `.utils.ts`.
- Boolean variables must start with `is`, `has`, `can`, or `should`.
- Event handlers must start with `handle`.

## State Rules

- UI-only state may stay in component-specific hooks.
- Shared state must use Zustand or Recoil.
- Do not store derived state if it can be calculated from props, store, or server data.
- Keep server state and client UI state separated.
- Do not mutate state directly.

## Export Rules

- Use named exports.
- Do not use default exports unless the existing project convention requires it.
- Each folder should expose public modules through `index.ts`.
- Do not export internal-only helpers from `index.ts`.

## Prohibited Patterns

- Do not write large components that contain types, constants, utils, hooks, and JSX in one file.
- Do not use `any`.
- Do not use magic numbers in JSX.
- Do not create new folders or abstractions without clear responsibility.
- Do not move code unrelated to the current task.
- Do not introduce new dependencies without explicit approval.

## Review Priority

When writing or modifying components, prioritize:

1. Correct responsibility separation
2. Type safety
3. Readability
4. Consistency with existing project style
5. Minimal diff
