import type { PillProps } from './types/pill.types'

import styles from './Pill.module.scss'

export const Pill = ({
    children,
    className,
    icon,
    tone = 'neutral',
    ...spanProps
}: PillProps) => {
    const classNames = [styles.pill, styles[tone], className]
        .filter(Boolean)
        .join(' ')

    return (
        <span className={classNames} {...spanProps}>
            {icon}
            <span className={styles.label}>{children}</span>
        </span>
    )
}
