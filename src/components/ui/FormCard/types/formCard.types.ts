import type { ReactNode } from 'react'

export type FormCardTitleVariant = 'default' | 'gradient'

export interface FormCardProps {
    children: ReactNode
    description: string
    eyebrow: string
    title: string
    titleId: string
    titleVariant?: FormCardTitleVariant
}
