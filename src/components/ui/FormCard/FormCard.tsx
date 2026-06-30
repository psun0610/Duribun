import type { FormCardProps } from './types/formCard.types'

import styles from './FormCard.module.scss'

export const formCardStyles = styles

export const FormCard = ({
    children,
    description,
    eyebrow,
    title,
    titleId,
    titleVariant = 'default',
}: FormCardProps) => {
    const titleClassName =
        titleVariant === 'gradient'
            ? `${styles.title} ${styles.titleGradient}`
            : styles.title

    return (
        <section className={styles.card} aria-labelledby={titleId}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 className={titleClassName} id={titleId}>
                {title}
            </h1>
            <p className={styles.description}>{description}</p>
            {children}
        </section>
    )
}
