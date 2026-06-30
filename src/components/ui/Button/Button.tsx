import type { ButtonProps } from './types/button.types'
import { Spinner } from '../Spinner'

import styles from './Button.module.scss'

export const Button = ({
    children,
    className,
    disabled,
    isLoading = false,
    leftIcon,
    rightIcon,
    size = 'md',
    type = 'button',
    variant = 'primary',
    ...buttonProps
}: ButtonProps) => {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <button
            className={classNames}
            disabled={disabled || isLoading}
            type={type}
            {...buttonProps}
        >
            {isLoading ? <Spinner /> : leftIcon}
            <span className={styles.label}>{children}</span>
            {rightIcon}
        </button>
    )
}
