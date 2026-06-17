import type { CoupleSummary } from '@/features/couple/types/coupleOnboarding.types'
import type {
    ChangeEvent,
    ClipboardEvent,
    KeyboardEvent,
    RefObject,
} from 'react'

export interface CoupleOnboardingProps {
    initialCouple: CoupleSummary | null
    userLabel: string
}

export type CoupleOnboardingMode = 'select' | 'create' | 'join'

export interface ModeSelectorProps {
    onCreateCouple: () => void
    onJoinMode: () => void
}

export interface InviteCodePanelProps {
    createdCouple: CoupleSummary | null
    errorMessage: string
    hasCopiedInviteCode: boolean
    isCreatingCouple: boolean
    onCopyInviteCode: () => void
    onShareInviteCode: () => void
}

export interface JoinCoupleFormProps {
    errorMessage: string
    inputRefs: RefObject<Array<HTMLInputElement | null>>
    inviteCode: string
    inviteCodeCharacters: string[]
    joinAction: (formData: FormData) => void
    onInviteCodeChange: (
        index: number,
        event: ChangeEvent<HTMLInputElement>
    ) => void
    onInviteCodeKeyDown: (
        index: number,
        event: KeyboardEvent<HTMLInputElement>
    ) => void
    onInviteCodePaste: (event: ClipboardEvent<HTMLInputElement>) => void
}
