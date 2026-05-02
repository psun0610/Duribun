'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, apiCall } from '@/lib/supabase/client'
import { AuthPage } from '@/app/auth'
import { CoupleMatchPage } from '@/app/couple'
import { Dashboard } from '@/app/dashboard'
import { motion } from 'motion/react'
import { Heart } from 'lucide-react'

const HomePage = () => {
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isCoupleMatched, setIsCoupleMatched] = useState(false)

    const checkCoupleStatus = useCallback(async () => {
        try {
            const response = (await apiCall('/couple/status')) as {
                matched?: boolean
            }
            setIsCoupleMatched(!!response.matched)
        } catch (err) {
            console.error('Failed to check couple status:', err)
            setIsCoupleMatched(false)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()
            setIsAuthenticated(!!session)
            if (session) {
                await checkCoupleStatus()
            } else {
                setLoading(false)
            }
        }

        void checkAuth()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session)
            if (session) {
                void checkCoupleStatus()
            } else {
                setIsCoupleMatched(false)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [checkCoupleStatus])

    const handleAuthSuccess = () => {
        setIsAuthenticated(true)
        void checkCoupleStatus()
    }

    const handleMatchSuccess = () => {
        setIsCoupleMatched(true)
    }

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
        return <AuthPage onAuthSuccess={handleAuthSuccess} />
    }

    if (!isCoupleMatched) {
        return <CoupleMatchPage onMatchSuccess={handleMatchSuccess} />
    }

    return <Dashboard />
}

export default HomePage
