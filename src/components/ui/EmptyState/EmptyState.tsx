import type { EmptyStateProps } from './types/emptyState.types'

import styles from './EmptyState.module.scss'

export const EmptyState = ({
    action,
    className,
    description,
    icon,
    title,
}: EmptyStateProps) => {
    const classNames = [styles.emptyState, className].filter(Boolean).join(' ')

    return (
        <section className={classNames}>
            <div className={styles.iconBox} aria-hidden="true">
                {icon}
            </div>
            <div className={styles.copy}>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            {action ? <div className={styles.action}>{action}</div> : null}
        </section>
    )
}
