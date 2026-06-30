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

import {
    COUPLE_ONBOARDING_COPY,
    INVITE_CODE_LENGTH,
} from '../const/coupleOnboarding.const'
import type {
    CoupleOnboardingMode,
    CoupleOnboardingProps,
} from '../types/coupleOnboarding.types'

export const useCoupleOnboarding = ({
    initialCouple,
}: Pick<CoupleOnboardingProps, 'initialCouple'>) => {
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
        ? COUPLE_ONBOARDING_COPY.inviteCodeIssuedTitle
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

    return {
        createdCouple,
        createErrorMessage: createState.errorMessage,
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
        joinErrorMessage: joinState.errorMessage,
        mode,
    }
}
