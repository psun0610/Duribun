import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    isLoading?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    size?: ButtonSize
    variant?: ButtonVariant
}
