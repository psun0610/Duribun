'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchPlaces } from '../api'
import { Place } from '../types'

export const usePlaces = () => {
    const [places, setPlaces] = useState<Place[]>([])
    const [loading, setLoading] = useState(true)

    const loadPlaces = useCallback(async () => {
        try {
            const data = await fetchPlaces()
            setPlaces(data)
        } catch (err) {
            console.error('Failed to load places:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadPlaces()
    }, [loadPlaces])

    return { places, loading, loadPlaces }
}
