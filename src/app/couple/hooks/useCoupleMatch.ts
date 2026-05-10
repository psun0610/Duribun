'use client'

import { useState } from 'react'
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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [partnerNickname, setPartnerNickname] = useState('')

    const handleCreateCode = async () => {
        setLoading(true)
        setError('')
        try {
            const code = await createCode()
            setGeneratedCode(code)
        } catch (err: unknown) {
            setError((err as Error).message || '코드 생성에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    const handleJoinCouple = async () => {
        setLoading(true)
        setError('')
        try {
            await joinCouple(inputCode)
            setLoading(false)
            setMode('nickname')
        } catch (err: unknown) {
            setError((err as Error).message || '커플 연결에 실패했습니다')
            setLoading(false)
        }
    }

    const handleSaveNickname = async () => {
        if (!partnerNickname.trim()) return

        setLoading(true)
        setError('')
        try {
            await saveNickname(partnerNickname.trim())
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#FF9B9B', '#FFD4C4', '#FFCBA4'],
            })
            setTimeout(() => onMatchSuccess(), 1500)
        } catch (err: unknown) {
            setError((err as Error).message || '별명 저장에 실패했습니다')
            setLoading(false)
        }
    }

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
        handleCreateCode,
        handleJoinCouple,
        handleSaveNickname,
        handleShare,
    }
}
