import type { FieldMessageProps } from './types/fieldMessage.types'

import styles from './FieldMessage.module.scss'

export const FieldMessage = ({
    children,
    className,
    variant = 'support',
    ...paragraphProps
}: FieldMessageProps) => {
    const classNames = [styles.message, styles[variant], className]
        .filter(Boolean)
        .join(' ')

    return (
        <p className={classNames} {...paragraphProps}>
            {children}
        </p>
    )
}
