'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import { createCode, joinCouple, saveNickname } from '../api'
import { CoupleMode } from '../types'

export const useCoupleMatch = (
    onMatchSuccess: () => void,
    initialMode: CoupleMode,
) => {
    const [mode, setMode] = useState<CoupleMode>(initialMode)
    const [inputCode, setInputCode] = useState('')
    const [generatedCode, setGeneratedCode] = useState('')
    const [error, setError] = useState('')
    const [partnerNickname, setPartnerNickname] = useState('')

    const createCodeMutation = useMutation({
        mutationFn: createCode,
        onSuccess: (code) => {
            setGeneratedCode(code)
            setError('')
        },
        onError: (err: Error) => {
            setError(err.message || '코드 생성에 실패했습니다')
        },
    })

    const joinCoupleMutation = useMutation({
        mutationFn: () => joinCouple(inputCode),
        onSuccess: () => {
            setError('')
            setMode('nickname')
        },
        onError: (err: Error) => {
            setError(err.message || '커플 연결에 실패했습니다')
        },
    })

    const saveNicknameMutation = useMutation({
        mutationFn: () => saveNickname(partnerNickname.trim()),
        onSuccess: () => {
            setError('')
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#FF9B9B', '#FFD4C4', '#FFCBA4'],
            })
            setTimeout(() => onMatchSuccess(), 1500)
        },
        onError: (err: Error) => {
            setError(err.message || '별명 저장에 실패했습니다')
        },
    })

    const handleShare = async () => {
        const message = `나랑 우리만의 추억 지도를 그려보지 않을래?\n📍 두리번 초대 코드: [${generatedCode}]`

        if (navigator.share) {
            try {
                await navigator.share({ title: '두리번 초대', text: message })
                toast('초대를 보냈습니다! 💌')
            } catch {
                // 사용자가 공유를 취소한 경우 무시
            }
        } else {
            await navigator.clipboard.writeText(message)
            toast('코드가 복사되었습니다! 🎉')
        }
    }

    const loading =
        createCodeMutation.isPending ||
        joinCoupleMutation.isPending ||
        saveNicknameMutation.isPending

    return {
        mode,
        setMode,
        inputCode,
        setInputCode,
        generatedCode,
        loading,
        error,
        partnerNickname,
        setPartnerNickname,
        handleCreateCode: () => createCodeMutation.mutate(),
        handleJoinCouple: () => joinCoupleMutation.mutate(),
        handleSaveNickname: () => saveNicknameMutation.mutate(),
        handleShare,
    }
}
