'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, apiCall } from '@/lib/supabase/client'

export const useAppInit = () => {
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isCoupleMatched, setIsCoupleMatched] = useState(false)

    const checkCoupleStatus = useCallback(async () => {
        try {
            const response = (await apiCall('/couple/status')) as {
                matched?: boolean
            }
            setIsCoupleMatched(!!response.matched)
        } catch {
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

    return {
        loading,
        isAuthenticated,
        setIsAuthenticated,
        isCoupleMatched,
        setIsCoupleMatched,
    }
}
