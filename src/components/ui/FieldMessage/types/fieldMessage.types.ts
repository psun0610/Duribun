import type { HTMLAttributes, ReactNode } from 'react'

export type FieldMessageVariant = 'error' | 'success' | 'support'

export interface FieldMessageProps extends HTMLAttributes<HTMLParagraphElement> {
    children: ReactNode
    variant?: FieldMessageVariant
}
