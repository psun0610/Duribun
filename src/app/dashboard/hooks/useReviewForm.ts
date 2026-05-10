'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import confetti from 'canvas-confetti'
import { addReview } from '../api'
import { Place, PlaceCategory } from '../types'
import { PLACES_QUERY_KEY } from './usePlaces'
import { supabase } from '@/lib/supabase/client'

const CATEGORY_FIELDS: Record<PlaceCategory | string, string[]> = {
    식당: ['맛', '분위기', '가성비', '청결도', '만족도'],
    카페: ['커피맛', '디저트', '좌석', '감성', '만족도'],
    액티비티: ['재미', '활동량', '소요시간', '만족도'],
}

export const getCategoryFields = (category: string): string[] =>
    CATEGORY_FIELDS[category] ?? ['평가']

const MAX_IMAGES = 5
const BUCKET = 'review-images'

const uploadToStorage = async (files: File[], placeId: string): Promise<string[]> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const urls: string[] = []
    for (const file of files) {
        const ext = file.name.split('.').pop() ?? 'jpg'
        const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const path = `reviews/${placeId}/${user.id}/${uniqueName}`

        const { error } = await supabase.storage.from(BUCKET).upload(path, file)
        if (error) throw new Error(error.message)

        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
        urls.push(urlData.publicUrl)
    }
    return urls
}

export const useReviewForm = (place: Place, onReviewAdded: () => void) => {
    const [ratings, setRatings] = useState<Record<string, number>>({})
    const [revisit, setRevisit] = useState(true)
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')

    // 이미 저장된 이미지 URL (수정 시 기존 이미지 유지/제거 가능)
    const [savedImageUrls, setSavedImageUrls] = useState<string[]>([])
    // 새로 선택한 파일 + 미리보기 URL
    const [newImageFiles, setNewImageFiles] = useState<File[]>([])
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

    const queryClient = useQueryClient()

    const fields = getCategoryFields(place.category)
    const myReview = place.myReview as Record<string, unknown> | undefined
    const partnerReview = place.partnerReview as
        | Record<string, unknown>
        | undefined

    useEffect(() => {
        if (myReview) {
            setRatings((myReview.ratings as Record<string, number>) ?? {})
            setRevisit((myReview.revisit as boolean) ?? true)
            setComment((myReview.comment as string) ?? '')
            setSavedImageUrls((myReview.images as string[]) ?? [])
        }
    }, [myReview])

    const totalImageCount = savedImageUrls.length + newImageFiles.length

    const addImages = (files: FileList) => {
        const remaining = MAX_IMAGES - totalImageCount
        if (remaining <= 0) return

        const toAdd = Array.from(files).slice(0, remaining)
        const previews = toAdd.map((f) => URL.createObjectURL(f))
        setNewImageFiles((prev) => [...prev, ...toAdd])
        setNewImagePreviews((prev) => [...prev, ...previews])
    }

    const removeSavedImage = (index: number) => {
        setSavedImageUrls((prev) => prev.filter((_, i) => i !== index))
    }

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(newImagePreviews[index])
        setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const handleRatingChange = (field: string, value: number) => {
        setRatings((prev) => ({ ...prev, [field]: value }))
    }

    const getAverageRating = () => {
        const values = Object.values(ratings)
        if (values.length === 0) return 0
        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
    }

    const isFirstSubmission = !myReview

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const uploadedUrls = newImageFiles.length > 0
                ? await uploadToStorage(newImageFiles, place.id)
                : []
            return addReview({
                placeId: place.id,
                ratings,
                revisit,
                comment,
                rating: parseFloat(String(getAverageRating())),
                images: [...savedImageUrls, ...uploadedUrls],
            })
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PLACES_QUERY_KEY })
            if (partnerReview && isFirstSubmission) {
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
        },
        onError: (err: Error) => {
            setError(err.message || '리뷰 작성에 실패했습니다')
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        mutate()
    }

    return {
        ratings,
        revisit,
        setRevisit,
        comment,
        setComment,
        loading: isPending,
        error,
        fields,
        myReview,
        partnerReview,
        handleRatingChange,
        getAverageRating,
        handleSubmit,
        savedImageUrls,
        newImagePreviews,
        totalImageCount,
        maxImages: MAX_IMAGES,
        addImages,
        removeSavedImage,
        removeNewImage,
    }
}
