'use client'

import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { AuthPage } from '@/app/auth'
import { CoupleMatchPage } from '@/app/couple'
import { Dashboard } from '@/app/dashboard'
import { useAppInit } from './_hooks/useAppInit'

const HomePage = () => {
    const {
        loading,
        isAuthenticated,
        setIsAuthenticated,
        isCoupleMatched,
        hasNickname,
        refetchCoupleStatus,
    } = useAppInit()

    if (loading) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <Heart className="size-12 fill-primary text-primary" />
                </motion.div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />
    }

    // 미매칭: 코드 생성/입력 화면
    if (!isCoupleMatched) {
        return (
            <CoupleMatchPage
                onMatchSuccess={() => void refetchCoupleStatus()}
            />
        )
    }

    // 매칭됨 + 별명 미설정: User B 성공 직후 또는 User A가 앱에 복귀했을 때
    if (!hasNickname) {
        return (
            <CoupleMatchPage
                initialMode="nickname"
                onMatchSuccess={() => void refetchCoupleStatus()}
            />
        )
    }

    return <Dashboard />
}

export default HomePage
