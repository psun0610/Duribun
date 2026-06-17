import type { ButtonProps } from './types/button.types'

import styles from './Button.module.scss'

export const Button = ({
    children,
    className,
    disabled,
    isLoading = false,
    leftIcon,
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
            {leftIcon}
            {children}
        </button>
    )
}
