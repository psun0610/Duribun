'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase, apiCall } from '@/lib/supabase/client'

export const COUPLE_STATUS_QUERY_KEY = ['couple-status'] as const

export type CoupleStatusResponse = {
    matched: boolean
    hasNickname: boolean
    partnerNickname: string | null
}

const fetchCoupleStatus = async (): Promise<CoupleStatusResponse> => {
    const res = (await apiCall('/couple/status')) as {
        matched?: boolean
        hasNickname?: boolean
        partnerNickname?: string | null
    }
    return {
        matched: !!res.matched,
        hasNickname: !!res.hasNickname,
        partnerNickname: res.partnerNickname ?? null,
    }
}

export const useAppInit = () => {
    const [authLoading, setAuthLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const coupleStatusQuery = useQuery({
        queryKey: COUPLE_STATUS_QUERY_KEY,
        queryFn: fetchCoupleStatus,
        enabled: isAuthenticated,
    })

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()
            setIsAuthenticated(!!session)
            setAuthLoading(false)
        }

        void checkAuth()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session)
        })

        return () => subscription.unsubscribe()
    }, [])

    const loading =
        authLoading || (isAuthenticated && coupleStatusQuery.isLoading)

    return {
        loading,
        isAuthenticated,
        setIsAuthenticated,
        isCoupleMatched: coupleStatusQuery.data?.matched ?? false,
        hasNickname: coupleStatusQuery.data?.hasNickname ?? false,
        refetchCoupleStatus: coupleStatusQuery.refetch,
    }
}
