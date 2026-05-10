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
        setIsCoupleMatched,
    } = useAppInit()

    if (loading) {
        return (
            <div className="flex min-h-dvh items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    <Heart className="size-12 fill-primary text-primary" />
                </motion.div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />
    }

    if (!isCoupleMatched) {
        return (
            <CoupleMatchPage onMatchSuccess={() => setIsCoupleMatched(true)} />
        )
    }

    return <Dashboard />
}

export default HomePage
