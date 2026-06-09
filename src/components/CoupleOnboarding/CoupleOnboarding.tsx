'use client'

import {
    useActionState,
    useRef,
    useState,
    useTransition,
    type ChangeEvent,
    type ClipboardEvent,
    type KeyboardEvent,
} from 'react'

import { createCouple, joinCouple } from '@/features/couple/actions'

import type {
    CoupleOnboardingMode,
    CoupleOnboardingProps,
} from './types/coupleOnboarding.types'
import {
    COUPLE_ONBOARDING_COPY,
    INVITE_CODE_LENGTH,
} from './const/coupleOnboarding.const'

import styles from './CoupleOnboarding.module.scss'

export const CoupleOnboarding = ({ initialCouple }: CoupleOnboardingProps) => {
    const [mode, setMode] = useState<CoupleOnboardingMode>(
        initialCouple ? 'create' : 'select'
    )
    const [createState, createAction] = useActionState(createCouple, {
        couple: initialCouple,
        errorMessage: '',
    })
    const [joinState, joinAction] = useActionState(joinCouple, {
        couple: null,
        errorMessage: '',
    })
    const [inviteCodeCharacters, setInviteCodeCharacters] = useState(
        Array.from({ length: INVITE_CODE_LENGTH }, () => '')
    )
    const [hasCopiedInviteCode, setHasCopiedInviteCode] = useState(false)
    const [isCreatingCouple, startCreateTransition] = useTransition()
    const inputRefs = useRef<Array<HTMLInputElement | null>>([])
    const createdCouple = createState.couple
    const inviteCode = inviteCodeCharacters.join('')
    const headerTitle = createdCouple
        ? '커플 코드가 발급됐어요'
        : COUPLE_ONBOARDING_COPY.pageTitle
    const headerDescription = createdCouple
        ? '상대에게 코드를 보내고, 상대가 입력하면 커플 공간이 연결돼요.'
        : COUPLE_ONBOARDING_COPY.pageDescription

    const handleCreateCouple = () => {
        setMode('create')
        startCreateTransition(() => {
            createAction()
        })
    }

    const handleJoinMode = () => {
        setMode('join')
    }

    const handleCopyInviteCode = async () => {
        if (!createdCouple) {
            return
        }

        await navigator.clipboard.writeText(createdCouple.inviteCode)
        setHasCopiedInviteCode(true)
    }

    const handleShareInviteCode = async () => {
        if (!createdCouple) {
            return
        }

        const shareText = `두리번 커플 코드: ${createdCouple.inviteCode}`

        if (navigator.share) {
            await navigator.share({
                text: shareText,
                title: '두리번 커플 코드',
            })
            return
        }

        await navigator.clipboard.writeText(createdCouple.inviteCode)
        setHasCopiedInviteCode(true)
    }

    const handleInviteCodeChange = (
        index: number,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const nextValue = event.target.value
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase()
            .slice(-1)

        setInviteCodeCharacters(previousCharacters => {
            const nextCharacters = [...previousCharacters]
            nextCharacters[index] = nextValue
            return nextCharacters
        })

        if (nextValue && index < INVITE_CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleInviteCodeKeyDown = (
        index: number,
        event: KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            event.key === 'Backspace' &&
            !inviteCodeCharacters[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleInviteCodePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault()

        const pastedCode = event.clipboardData
            .getData('text')
            .replace(/[^a-zA-Z0-9]/g, '')
            .toUpperCase()
            .slice(0, INVITE_CODE_LENGTH)
            .split('')
        const nextCharacters = Array.from(
            { length: INVITE_CODE_LENGTH },
            (_, index) => pastedCode[index] ?? ''
        )

        setInviteCodeCharacters(nextCharacters)
        inputRefs.current[
            Math.min(pastedCode.length, INVITE_CODE_LENGTH - 1)
        ]?.focus()
    }

    return (
        <main className={styles.onboarding}>
            <header className={styles.header}>
                <h1 className={styles.title}>{headerTitle}</h1>
                <p className={styles.description}>{headerDescription}</p>
            </header>

            {mode === 'select' ? (
                <div className={styles.optionGrid}>
                    <button
                        className={styles.optionButton}
                        onClick={handleCreateCouple}
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
                        onClick={handleJoinMode}
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
            ) : null}

            {mode === 'create' ? (
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
                                <button
                                    className={styles.button}
                                    onClick={handleCopyInviteCode}
                                    type="button"
                                >
                                    {hasCopiedInviteCode
                                        ? COUPLE_ONBOARDING_COPY.copyInviteCodeDoneLabel
                                        : COUPLE_ONBOARDING_COPY.copyInviteCodeLabel}
                                </button>
                                <button
                                    className={styles.secondaryButton}
                                    onClick={handleShareInviteCode}
                                    type="button"
                                >
                                    {
                                        COUPLE_ONBOARDING_COPY.shareInviteCodeLabel
                                    }
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.pendingPanel}>
                            {createState.errorMessage ? (
                                <p className={styles.errorMessage} role="alert">
                                    {createState.errorMessage}
                                </p>
                            ) : isCreatingCouple ? (
                                <p className={styles.panelDescription}>
                                    {COUPLE_ONBOARDING_COPY.pendingCreateLabel}
                                </p>
                            ) : (
                                <p className={styles.errorMessage} role="alert">
                                    {COUPLE_ONBOARDING_COPY.createFailedLabel}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            ) : null}

            {mode === 'join' ? (
                <section className={styles.panel}>
                    <form action={joinAction} className={styles.form}>
                        <input
                            name="inviteCode"
                            type="hidden"
                            value={inviteCode}
                        />
                        <div
                            aria-label={
                                COUPLE_ONBOARDING_COPY.inviteCodeAriaLabel
                            }
                            className={styles.codeInputGrid}
                            role="group"
                        >
                            {inviteCodeCharacters.map((character, index) => (
                                <input
                                    aria-label={`${COUPLE_ONBOARDING_COPY.inviteCodePlaceholder} ${index + 1}`}
                                    autoCapitalize="characters"
                                    className={styles.codeInput}
                                    inputMode="text"
                                    key={index}
                                    maxLength={1}
                                    onChange={event =>
                                        handleInviteCodeChange(index, event)
                                    }
                                    onKeyDown={event =>
                                        handleInviteCodeKeyDown(index, event)
                                    }
                                    onPaste={handleInviteCodePaste}
                                    ref={element => {
                                        inputRefs.current[index] = element
                                    }}
                                    type="text"
                                    value={character}
                                />
                            ))}
                        </div>
                        {joinState.errorMessage ? (
                            <p className={styles.errorMessage} role="alert">
                                {joinState.errorMessage}
                            </p>
                        ) : null}
                        <button
                            className={styles.button}
                            disabled={inviteCode.length !== INVITE_CODE_LENGTH}
                            type="submit"
                        >
                            {COUPLE_ONBOARDING_COPY.connectSubmitLabel}
                        </button>
                    </form>
                </section>
            ) : null}
        </main>
    )
}
