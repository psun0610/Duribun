import type { ProgressDotsProps } from './types/progressDots.types'

import styles from './ProgressDots.module.scss'

export const ProgressDots = ({
    activeIndex,
    className,
    count,
}: ProgressDotsProps) => {
    const classNames = [styles.dots, className].filter(Boolean).join(' ')

    return (
        <div className={classNames} aria-hidden="true">
            {Array.from({ length: count }).map((_, index) => (
                <span
                    className={index <= activeIndex ? styles.active : ''}
                    key={index}
                />
            ))}
        </div>
    )
}
