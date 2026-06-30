import type { BadgeProps } from './types/badge.types'

import styles from './Badge.module.scss'

export const Badge = ({
    children,
    className,
    size = 'md',
    variant = 'muted',
    ...spanProps
}: BadgeProps) => {
    const classNames = [
        styles.badge,
        styles[variant],
        styles[size],
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <span className={classNames} {...spanProps}>
            {children}
        </span>
    )
}
