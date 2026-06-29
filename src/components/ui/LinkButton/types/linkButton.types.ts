import type { ComponentProps, ReactNode } from 'react'
import type Link from 'next/link'

import type { ButtonSize, ButtonVariant } from '../../Button'

export interface LinkButtonProps extends ComponentProps<typeof Link> {
    children: ReactNode
    size?: Exclude<ButtonSize, 'icon'>
    variant?: ButtonVariant
}
