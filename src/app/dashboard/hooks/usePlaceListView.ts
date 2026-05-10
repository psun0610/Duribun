'use client'

import { useCallback, useEffect, useState } from 'react'
import type { PlaceListViewMode } from '../types'

const STORAGE_KEY = 'duribun-place-list-view'

const isMode = (v: string | null): v is PlaceListViewMode =>
    v === 'cards' || v === 'grid' || v === 'compact'

export const usePlaceListView = () => {
    const [mode, setModeState] = useState<PlaceListViewMode>('cards')

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (isMode(raw)) setModeState(raw)
        } catch {
            /* ignore */
        }
    }, [])

    const setMode = useCallback((next: PlaceListViewMode) => {
        setModeState(next)
        try {
            localStorage.setItem(STORAGE_KEY, next)
        } catch {
            /* ignore */
        }
    }, [])

    return { mode, setMode }
}
