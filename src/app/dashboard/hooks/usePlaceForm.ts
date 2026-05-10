'use client'

import { useState } from 'react'
import { addPlace } from '../api'
import { PlaceCategory } from '../types'

export const usePlaceForm = (onPlaceAdded: () => void) => {
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [category, setCategory] = useState<PlaceCategory>('식당')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await addPlace({ name, address, category })
            onPlaceAdded()
        } catch (err: unknown) {
            setError((err as Error).message || '장소 추가에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    return {
        name,
        setName,
        address,
        setAddress,
        category,
        setCategory,
        loading,
        error,
        handleSubmit,
    }
}
