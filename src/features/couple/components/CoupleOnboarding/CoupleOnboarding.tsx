'use client'

import { InviteCodePanel } from './components/InviteCodePanel'
import { JoinCoupleForm } from './components/JoinCoupleForm'
import { ModeSelector } from './components/ModeSelector'
import { useCoupleOnboarding } from './hooks/useCoupleOnboarding'
import type { CoupleOnboardingProps } from './types/coupleOnboarding.types'

import styles from './CoupleOnboarding.module.scss'

export const CoupleOnboarding = ({ initialCouple }: CoupleOnboardingProps) => {
    const {
        createdCouple,
        createErrorMessage,
        handleCopyInviteCode,
        handleCreateCouple,
        handleInviteCodeChange,
        handleInviteCodeKeyDown,
        handleInviteCodePaste,
        handleJoinMode,
        handleShareInviteCode,
        hasCopiedInviteCode,
        headerDescription,
        headerTitle,
        inputRefs,
        inviteCode,
        inviteCodeCharacters,
        isCreatingCouple,
        joinAction,
        joinErrorMessage,
        mode,
    } = useCoupleOnboarding({ initialCouple })

    return (
        <main className={styles.onboarding}>
            <header className={styles.header}>
                <h1 className={styles.title}>{headerTitle}</h1>
                <p className={styles.description}>{headerDescription}</p>
            </header>

            {mode === 'select' ? (
                <ModeSelector
                    onCreateCouple={handleCreateCouple}
                    onJoinMode={handleJoinMode}
                />
            ) : null}

            {mode === 'create' ? (
                <InviteCodePanel
                    createdCouple={createdCouple}
                    errorMessage={createErrorMessage}
                    hasCopiedInviteCode={hasCopiedInviteCode}
                    isCreatingCouple={isCreatingCouple}
                    onCopyInviteCode={handleCopyInviteCode}
                    onShareInviteCode={handleShareInviteCode}
                />
            ) : null}

            {mode === 'join' ? (
                <JoinCoupleForm
                    errorMessage={joinErrorMessage}
                    inputRefs={inputRefs}
                    inviteCode={inviteCode}
                    inviteCodeCharacters={inviteCodeCharacters}
                    joinAction={joinAction}
                    onInviteCodeChange={handleInviteCodeChange}
                    onInviteCodeKeyDown={handleInviteCodeKeyDown}
                    onInviteCodePaste={handleInviteCodePaste}
                />
            ) : null}
        </main>
    )
}
