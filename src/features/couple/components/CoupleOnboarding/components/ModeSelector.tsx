import { ChevronRight, HeartHandshake, Ticket } from 'lucide-react'

import { COUPLE_ONBOARDING_COPY } from '../const/coupleOnboarding.const'
import type { ModeSelectorProps } from '../types/coupleOnboarding.types'

import styles from '../CoupleOnboarding.module.scss'

export const ModeSelector = ({
    onCreateCouple,
    onJoinMode,
}: ModeSelectorProps) => {
    return (
        <div className={styles.optionGrid}>
            <button
                className={styles.optionButton}
                onClick={onCreateCouple}
                type="button"
            >
                <span className={styles.optionIcon}>
                    <Ticket aria-hidden="true" size={26} />
                </span>
                <span className={styles.optionTitle}>
                    {COUPLE_ONBOARDING_COPY.createOptionTitle}
                </span>
                <span className={styles.optionDescription}>
                    {COUPLE_ONBOARDING_COPY.createOptionDescription}
                </span>
                <ChevronRight
                    aria-hidden="true"
                    className={styles.optionArrow}
                    size={20}
                />
            </button>
            <button
                className={styles.optionButton}
                onClick={onJoinMode}
                type="button"
            >
                <span className={styles.optionIcon}>
                    <HeartHandshake aria-hidden="true" size={26} />
                </span>
                <span className={styles.optionTitle}>
                    {COUPLE_ONBOARDING_COPY.joinOptionTitle}
                </span>
                <span className={styles.optionDescription}>
                    {COUPLE_ONBOARDING_COPY.joinOptionDescription}
                </span>
                <ChevronRight
                    aria-hidden="true"
                    className={styles.optionArrow}
                    size={20}
                />
            </button>
        </div>
    )
}
