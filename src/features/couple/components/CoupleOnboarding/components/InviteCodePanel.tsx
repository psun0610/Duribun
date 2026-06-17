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
                    <strong className={styles.inviteCodeValue}>
                        {createdCouple.inviteCode}
                    </strong>
                    <div className={styles.actionRow}>
                        <Button onClick={onCopyInviteCode} type="button">
                            {hasCopiedInviteCode
                                ? COUPLE_ONBOARDING_COPY.copyInviteCodeDoneLabel
                                : COUPLE_ONBOARDING_COPY.copyInviteCodeLabel}
                        </Button>
                        <Button
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
