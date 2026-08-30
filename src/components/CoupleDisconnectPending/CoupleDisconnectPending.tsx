import { Clock3, LockKeyhole } from 'lucide-react'

import { Button, FieldMessage } from '@/components/ui'
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
            <div className={styles.navBar}>
                <span className={styles.brand}>
                    {COUPLE_DISCONNECT_PENDING_COPY.appTitle}
                </span>
            </div>

            <section aria-labelledby="locked-title" className={styles.content}>
                <span aria-hidden="true" className={styles.lockTile}>
                    <LockKeyhole aria-hidden="true" size={50} />
                </span>

                <h1 className={styles.title} id="locked-title">
                    {COUPLE_DISCONNECT_PENDING_COPY.title}
                </h1>
                <p className={styles.coupleName}>{coupleName}</p>

                <span className={styles.graceChip}>
                    <Clock3 aria-hidden="true" size={15} />
                    {COUPLE_DISCONNECT_PENDING_COPY.graceChip}
                </span>

                <p className={styles.description}>
                    {COUPLE_DISCONNECT_PENDING_COPY.description}
                </p>
                <p className={styles.graceNotice}>
                    {COUPLE_DISCONNECT_PENDING_COPY.graceNotice}
                </p>

                <div className={styles.dateCards}>
                    <div className={styles.dateCard}>
                        <span>
                            {COUPLE_DISCONNECT_PENDING_COPY.requestedAtLabel}
                        </span>
                        <strong>{formatKoreanDate(requestedAt)}</strong>
                    </div>
                    <div className={`${styles.dateCard} ${styles.dateCardPink}`}>
                        <span>
                            {
                                COUPLE_DISCONNECT_PENDING_COPY.scheduledDeleteLabel
                            }
                        </span>
                        <strong>{formatKoreanDate(deleteAfter)}</strong>
                    </div>
                </div>

                {errorMessage ? (
                    <FieldMessage
                        className={styles.errorMessage}
                        variant="error"
                    >
                        {errorMessage}
                    </FieldMessage>
                ) : null}

                <div className={styles.actions}>
                    <form action={cancelCoupleDisconnect}>
                        <Button className={styles.fullWidth} type="submit">
                            {COUPLE_DISCONNECT_PENDING_COPY.cancel}
                        </Button>
                    </form>
                    <form action={signOut}>
                        <Button
                            className={styles.fullWidth}
                            type="submit"
                            variant="secondary"
                        >
                            {COUPLE_DISCONNECT_PENDING_COPY.signOut}
                        </Button>
                    </form>
                </div>
            </section>
        </main>
    )
}
