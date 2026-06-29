import { LockKeyhole } from 'lucide-react'

import { Button, EmptyState, FieldMessage } from '@/components/ui'
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

                <EmptyState
                    className={styles.emptyState}
                    description={COUPLE_DISCONNECT_PENDING_COPY.description}
                    icon={<LockKeyhole />}
                    title={COUPLE_DISCONNECT_PENDING_COPY.title}
                />

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
                    <FieldMessage className={styles.errorMessage} variant="error">
                        {errorMessage}
                    </FieldMessage>
                ) : null}

                <div className={styles.actions}>
                    <form action={cancelCoupleDisconnect}>
                        <Button type="submit">
                            {COUPLE_DISCONNECT_PENDING_COPY.cancel}
                        </Button>
                    </form>
                    <form action={signOut}>
                        <Button type="submit" variant="secondary">
                            {COUPLE_DISCONNECT_PENDING_COPY.signOut}
                        </Button>
                    </form>
                </div>
            </section>
        </main>
    )
}
