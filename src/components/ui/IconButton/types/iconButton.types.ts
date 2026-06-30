import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type IconButtonVariant = 'primary' | 'secondary' | 'plain'

export interface IconButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    'aria-label': string
    children: ReactNode
    variant?: IconButtonVariant
}
