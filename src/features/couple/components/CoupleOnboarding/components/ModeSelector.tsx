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
                <span className={styles.optionTitle}>
                    {COUPLE_ONBOARDING_COPY.createOptionTitle}
                </span>
                <span className={styles.optionDescription}>
                    {COUPLE_ONBOARDING_COPY.createOptionDescription}
                </span>
            </button>
            <button
                className={styles.optionButton}
                onClick={onJoinMode}
                type="button"
            >
                <span className={styles.optionTitle}>
                    {COUPLE_ONBOARDING_COPY.joinOptionTitle}
                </span>
                <span className={styles.optionDescription}>
                    {COUPLE_ONBOARDING_COPY.joinOptionDescription}
                </span>
            </button>
        </div>
    )
}
