import Link from 'next/link'

import type { LinkButtonProps } from './types/linkButton.types'

import styles from './LinkButton.module.scss'

export const LinkButton = ({
    children,
    className,
    size = 'md',
    variant = 'primary',
    ...linkProps
}: LinkButtonProps) => {
    const classNames = [
        styles.linkButton,
        styles[variant],
        styles[size],
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <Link className={classNames} {...linkProps}>
            <span className={styles.label}>{children}</span>
        </Link>
    )
}
