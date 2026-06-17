import { Button, FieldMessage } from '@/components/ui'

import {
    COUPLE_ONBOARDING_COPY,
    INVITE_CODE_LENGTH,
} from '../const/coupleOnboarding.const'
import type { JoinCoupleFormProps } from '../types/coupleOnboarding.types'

import styles from '../CoupleOnboarding.module.scss'

export const JoinCoupleForm = ({
    errorMessage,
    inputRefs,
    inviteCode,
    inviteCodeCharacters,
    joinAction,
    onInviteCodeChange,
    onInviteCodeKeyDown,
    onInviteCodePaste,
}: JoinCoupleFormProps) => {
    return (
        <section className={styles.panel}>
            <form action={joinAction} className={styles.form}>
                <input name="inviteCode" type="hidden" value={inviteCode} />
                <div
                    aria-label={COUPLE_ONBOARDING_COPY.inviteCodeAriaLabel}
                    className={styles.codeInputGrid}
                    role="group"
                >
                    {inviteCodeCharacters.map((character, index) => (
                        <input
                            aria-label={`${COUPLE_ONBOARDING_COPY.inviteCodePlaceholder} ${
                                index + 1
                            }`}
                            autoCapitalize="characters"
                            className={styles.codeInput}
                            inputMode="text"
                            key={index}
                            maxLength={1}
                            onChange={event =>
                                onInviteCodeChange(index, event)
                            }
                            onKeyDown={event =>
                                onInviteCodeKeyDown(index, event)
                            }
                            onPaste={onInviteCodePaste}
                            ref={element => {
                                inputRefs.current[index] = element
                            }}
                            type="text"
                            value={character}
                        />
                    ))}
                </div>
                {errorMessage ? (
                    <FieldMessage role="alert" variant="error">
                        {errorMessage}
                    </FieldMessage>
                ) : null}
                <Button
                    disabled={inviteCode.length !== INVITE_CODE_LENGTH}
                    type="submit"
                >
                    {COUPLE_ONBOARDING_COPY.connectSubmitLabel}
                </Button>
            </form>
        </section>
    )
}
