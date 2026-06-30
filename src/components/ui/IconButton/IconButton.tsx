import type { IconButtonProps } from './types/iconButton.types'

import styles from './IconButton.module.scss'

export const IconButton = ({
    children,
    className,
    type = 'button',
    variant = 'secondary',
    ...buttonProps
}: IconButtonProps) => {
    const classNames = [styles.button, styles[variant], className]
        .filter(Boolean)
        .join(' ')

    return (
        <button className={classNames} type={type} {...buttonProps}>
            {children}
        </button>
    )
}
