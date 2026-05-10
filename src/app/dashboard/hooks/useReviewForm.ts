'use client'

import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { addReview } from '../api'
import { Place, PlaceCategory } from '../types'

const CATEGORY_FIELDS: Record<PlaceCategory | string, string[]> = {
    식당: ['맛', '분위기', '가성비', '청결도', '만족도'],
    카페: ['커피맛', '디저트', '좌석', '감성', '만족도'],
    액티비티: ['재미', '활동량', '소요시간', '만족도'],
}

export const getCategoryFields = (category: string): string[] =>
    CATEGORY_FIELDS[category] ?? ['평가']

export const useReviewForm = (place: Place, onReviewAdded: () => void) => {
    const [ratings, setRatings] = useState<Record<string, number>>({})
    const [revisit, setRevisit] = useState(true)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fields = getCategoryFields(place.category)
    const myReview = place.myReview as Record<string, unknown> | undefined
    const partnerReview = place.partnerReview as Record<string, unknown> | undefined

    useEffect(() => {
        if (myReview) {
            setRatings((myReview.ratings as Record<string, number>) ?? {})
            setRevisit((myReview.revisit as boolean) ?? true)
            setComment((myReview.comment as string) ?? '')
        }
    }, [myReview])

    const handleRatingChange = (field: string, value: number) => {
        setRatings((prev) => ({ ...prev, [field]: value }))
    }

    const getAverageRating = () => {
        const values = Object.values(ratings)
        if (values.length === 0) return 0
        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await addReview({
                placeId: place.id,
                ratings,
                revisit,
                comment,
                rating: parseFloat(String(getAverageRating())),
            })

            if (partnerReview) {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#FF9B9B', '#FFD4C4', '#FFCBA4'],
                    shapes: ['circle'],
                    scalar: 1.2,
                })
                setTimeout(() => onReviewAdded(), 1500)
            } else {
                onReviewAdded()
            }
        } catch (err: unknown) {
            setError((err as Error).message || '리뷰 작성에 실패했습니다')
        } finally {
            setLoading(false)
        }
    }

    return {
        ratings,
        revisit,
        setRevisit,
        comment,
        setComment,
        loading,
        error,
        fields,
        myReview,
        partnerReview,
        handleRatingChange,
        getAverageRating,
        handleSubmit,
    }
}
