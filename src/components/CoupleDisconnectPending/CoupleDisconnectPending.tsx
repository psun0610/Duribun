import { LockKeyhole } from 'lucide-react'

import { signOut } from '@/features/auth/actions'
import { cancelCoupleDisconnect } from '@/features/couple/actions'

import type { CoupleDisconnectPendingProps } from './types/coupleDisconnectPending.types'
import { COUPLE_DISCONNECT_PENDING_COPY } from './const/coupleDisconnectPending.const'
import { formatKoreanDate } from './utils/coupleDisconnectPending.utils'

import styles from './CoupleDisconnectPending.module.scss'

export const CoupleDisconnectPending = ({
    coupleName,
    deleteAfter,
    errorMessage,
    requestedAt,
}: CoupleDisconnectPendingProps) => {
    return (
        <main className={styles.page}>
            <section className={styles.panel}>
                <div>
                    <h1 className={styles.brand}>
                        {COUPLE_DISCONNECT_PENDING_COPY.appTitle}
                    </h1>
                    <p className={styles.coupleName}>{coupleName}</p>
                </div>

                <div className={styles.lockIcon}>
                    <LockKeyhole aria-hidden="true" />
                </div>

                <div className={styles.copy}>
                    <h2>{COUPLE_DISCONNECT_PENDING_COPY.title}</h2>
                    <p>{COUPLE_DISCONNECT_PENDING_COPY.description}</p>
                </div>

                <dl className={styles.details}>
                    <div>
                        <dt>
                            {COUPLE_DISCONNECT_PENDING_COPY.requestedAtLabel}
                        </dt>
                        <dd>{formatKoreanDate(requestedAt)}</dd>
                    </div>
                    <div>
                        <dt>
                            {
                                COUPLE_DISCONNECT_PENDING_COPY.scheduledDeleteLabel
                            }
                        </dt>
                        <dd>{formatKoreanDate(deleteAfter)}</dd>
                    </div>
                </dl>

                {errorMessage ? (
                    <p className={styles.errorMessage}>{errorMessage}</p>
                ) : null}

                <div className={styles.actions}>
                    <form action={cancelCoupleDisconnect}>
                        <button className={styles.primaryButton} type="submit">
                            {COUPLE_DISCONNECT_PENDING_COPY.cancel}
                        </button>
                    </form>
                    <form action={signOut}>
                        <button className={styles.secondaryButton} type="submit">
                            {COUPLE_DISCONNECT_PENDING_COPY.signOut}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    )
}
