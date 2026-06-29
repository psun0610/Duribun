import type { HTMLAttributes, ReactNode } from 'react'

export type BadgeVariant =
    | 'primary'
    | 'primarySoft'
    | 'secondary'
    | 'muted'
    | 'outline'

export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode
    size?: BadgeSize
    variant?: BadgeVariant
}
