'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addPlace } from '../api'
import { PlaceCategory } from '../types'
import { PLACES_QUERY_KEY } from './usePlaces'

export const usePlaceForm = (onPlaceAdded: () => void) => {
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [category, setCategory] = useState<PlaceCategory>('식당')
    const [error, setError] = useState('')

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => addPlace({ name, address, category }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PLACES_QUERY_KEY })
            onPlaceAdded()
        },
        onError: (err: Error) => {
            setError(err.message || '장소 추가에 실패했습니다')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        mutate()
    }

    return {
        name,
        setName,
        address,
        setAddress,
        category,
        setCategory,
        loading: isPending,
        error,
        handleSubmit,
    }
}
