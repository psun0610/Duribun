import { Clock3, Heart } from 'lucide-react'

import { LinkButton } from '@/components/ui'
import { HOME_ACTIONS, HOME_COPY } from './const/homeIntro.const'

import styles from './HomeIntro.module.scss'

export const HomeIntro = () => {
    return (
        <main className={styles.home}>
            <div className={styles.brandRow}>
                <span aria-hidden="true" className={styles.brandMark}>
                    <Heart aria-hidden="true" size={14} />
                </span>
                <span className={styles.brandName}>{HOME_COPY.brand}</span>
            </div>

            <section className={styles.hero} aria-labelledby="home-title">
                <h1 className={styles.title} id="home-title">
                    {HOME_COPY.title}
                </h1>
                <p className={styles.description}>{HOME_COPY.description}</p>
            </section>

            <div
                aria-label={HOME_COPY.collageLabel}
                className={styles.collage}
                role="img"
            >
                <span aria-hidden="true" className={styles.cardSea}>
                    <span className={styles.cardSeaSun} />
                    <span className={styles.cardSeaBand} />
                </span>
                <span aria-hidden="true" className={styles.cardSunset}>
                    <span className={styles.cardSunsetSun} />
                    <span className={styles.cardSunsetBand} />
                </span>
                <span className={styles.statusChip}>
                    <span className={styles.statusChipIcon}>
                        <Clock3 aria-hidden="true" size={13} />
                    </span>
                    {HOME_COPY.statusChip}
                </span>
            </div>

            <div className={styles.actions}>
                {HOME_ACTIONS.map(action => (
                    <LinkButton
                        href={action.href}
                        key={action.label}
                        size="lg"
                        variant={
                            action.variant === 'primaryAction'
                                ? 'primary'
                                : 'secondary'
                        }
                    >
                        {action.label}
                    </LinkButton>
                ))}
                <p className={styles.privacyCaption}>
                    {HOME_COPY.privacyCaption}
                </p>
            </div>
        </main>
    )
}
