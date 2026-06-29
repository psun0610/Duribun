import type { SegmentedControlProps } from './types/segmentedControl.types'

import styles from './SegmentedControl.module.scss'

export const SegmentedControl = ({
    ariaLabel,
    className,
    onChange,
    options,
    value,
}: SegmentedControlProps) => {
    const classNames = [styles.control, className].filter(Boolean).join(' ')

    return (
        <div aria-label={ariaLabel} className={classNames} role="group">
            {options.map(option => {
                const isActive = option.value === value

                return (
                    <button
                        aria-pressed={isActive}
                        className={`${styles.item} ${
                            isActive ? styles.active : ''
                        }`}
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        type="button"
                    >
                        {option.icon}
                        <span>{option.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
