import type { HTMLAttributes, ReactNode } from 'react'

export type PillTone = 'neutral' | 'primary' | 'rating' | 'privacy'

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode
    icon?: ReactNode
    tone?: PillTone
}
