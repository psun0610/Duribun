import {
    Bell,
    ChevronRight,
    Database,
    Globe2,
    HelpCircle,
    Lock,
    ShieldCheck,
    Users,
} from 'lucide-react'

import { Button } from '@/components/ui'
import { signOut } from '@/features/auth/actions'
import { requestCoupleDisconnect } from '@/features/couple/actions'

import {
    COUPLE_PLACE_APP_COPY,
    SETTINGS_COPY,
} from '../const/couplePlaceApp.const'
import type { SettingsPanelProps } from '../types/couplePlaceAppComponent.types'

import styles from './SettingsPanel.module.scss'

export const SettingsPanel = ({
    coupleName,
    friendCoupleCount,
    publicPlaceCount,
    userLabel,
}: SettingsPanelProps) => {
    return (
        <div className={styles.panel}>
            <section className={styles.profileCard}>
                <div className={styles.avatar}>
                    {userLabel.slice(0, 1).toUpperCase()}
                </div>
                <div className={styles.profileText}>
                    <strong>{coupleName}</strong>
                    <span>{userLabel}</span>
                </div>
                <ChevronRight aria-hidden="true" size={18} />
            </section>

            <section className={styles.menuGroup} aria-label={SETTINGS_COPY.menuLabel}>
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <Lock size={17} />
                    </span>
                    <span>{SETTINGS_COPY.publicPlaces}</span>
                    <strong>{publicPlaceCount}</strong>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <Users size={17} />
                    </span>
                    <span>{SETTINGS_COPY.friends}</span>
                    <strong>{friendCoupleCount}</strong>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <ShieldCheck size={17} />
                    </span>
                    <span>{SETTINGS_COPY.couple}</span>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <Bell size={17} />
                    </span>
                    <span>{SETTINGS_COPY.notifications}</span>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
            </section>

            <section className={styles.shareGuide} aria-label={SETTINGS_COPY.shareGuideLabel}>
                <h2>{SETTINGS_COPY.shareGuideTitle}</h2>
                <p>{SETTINGS_COPY.shareGuideDescription}</p>
                <div className={styles.shareCards}>
                    <article className={styles.publicCard}>
                        <Globe2 size={30} />
                        <strong>{SETTINGS_COPY.publicTitle}</strong>
                        <ul>
                            {SETTINGS_COPY.publicPoints.map(point => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </article>
                    <article className={styles.privateCard}>
                        <Lock size={30} />
                        <strong>{SETTINGS_COPY.privateTitle}</strong>
                        <ul>
                            {SETTINGS_COPY.privatePoints.map(point => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </article>
                </div>
            </section>

            <section className={styles.menuGroup} aria-label={SETTINGS_COPY.dataLabel}>
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <Database size={17} />
                    </span>
                    <span>{SETTINGS_COPY.myData}</span>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
                <button className={styles.menuRow} type="button">
                    <span className={styles.menuIcon}>
                        <HelpCircle size={17} />
                    </span>
                    <span>{SETTINGS_COPY.faq}</span>
                    <ChevronRight aria-hidden="true" size={16} />
                </button>
            </section>

            <div className={styles.actionStack}>
                <form action={signOut}>
                    <Button className={styles.fullWidth} size="sm" type="submit" variant="secondary">
                        {COUPLE_PLACE_APP_COPY.logout}
                    </Button>
                </form>
                <form action={requestCoupleDisconnect}>
                    <Button className={styles.fullWidth} size="sm" type="submit" variant="secondary">
                        {COUPLE_PLACE_APP_COPY.requestDisconnect}
                    </Button>
                </form>
            </div>
        </div>
    )
}
