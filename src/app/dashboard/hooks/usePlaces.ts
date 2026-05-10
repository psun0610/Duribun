'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchPlaces } from '../api'

export const PLACES_QUERY_KEY = ['places'] as const

export const usePlaces = () => {
    const { data: places = [], isLoading } = useQuery({
        queryKey: PLACES_QUERY_KEY,
        queryFn: fetchPlaces,
    })

    return { places, loading: isLoading }
}
