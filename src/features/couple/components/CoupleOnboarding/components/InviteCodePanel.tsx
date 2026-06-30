import { Clock, Copy, RefreshCw } from 'lucide-react'

import { Button, FieldMessage } from '@/components/ui'

import { COUPLE_ONBOARDING_COPY } from '../const/coupleOnboarding.const'
import type { InviteCodePanelProps } from '../types/coupleOnboarding.types'

import styles from '../CoupleOnboarding.module.scss'

export const InviteCodePanel = ({
    createdCouple,
    errorMessage,
    hasCopiedInviteCode,
    isCreatingCouple,
    onCopyInviteCode,
    onShareInviteCode,
}: InviteCodePanelProps) => {
    return (
        <section className={styles.panel}>
            {createdCouple ? (
                <>
                    <h2 className={styles.panelTitle}>
                        {COUPLE_ONBOARDING_COPY.inviteCodeIssuedTitle}
                    </h2>
                    <div className={styles.inviteCodeCard}>
                        <span>{COUPLE_ONBOARDING_COPY.inviteCodeCardLabel}</span>
                        <strong>{createdCouple.inviteCode}</strong>
                        <small>
                            <Clock aria-hidden="true" size={14} />
                            {COUPLE_ONBOARDING_COPY.inviteCodeTimer}
                        </small>
                    </div>
                    <div className={styles.actionRow}>
                        <Button
                            leftIcon={<Copy aria-hidden="true" size={16} />}
                            onClick={onCopyInviteCode}
                            type="button"
                            variant="secondary"
                        >
                            {hasCopiedInviteCode
                                ? COUPLE_ONBOARDING_COPY.copyInviteCodeDoneLabel
                                : COUPLE_ONBOARDING_COPY.copyInviteCodeLabel}
                        </Button>
                        <Button
                            leftIcon={<RefreshCw aria-hidden="true" size={16} />}
                            onClick={onShareInviteCode}
                            type="button"
                            variant="secondary"
                        >
                            {COUPLE_ONBOARDING_COPY.shareInviteCodeLabel}
                        </Button>
                    </div>
                </>
            ) : (
                <div className={styles.pendingPanel}>
                    {errorMessage ? (
                        <FieldMessage role="alert" variant="error">
                            {errorMessage}
                        </FieldMessage>
                    ) : isCreatingCouple ? (
                        <p className={styles.panelDescription}>
                            {COUPLE_ONBOARDING_COPY.pendingCreateLabel}
                        </p>
                    ) : (
                        <FieldMessage role="alert" variant="error">
                            {COUPLE_ONBOARDING_COPY.createFailedLabel}
                        </FieldMessage>
                    )}
                </div>
            )}
        </section>
    )
}
