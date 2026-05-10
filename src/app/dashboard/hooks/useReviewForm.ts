'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import confetti from 'canvas-confetti'
import { addReview } from '../api'
import { formatRatingDisplay } from '../ratingFormat'
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

const uploadAndSavePlaceImages = async (
    files: File[],
    placeId: string,
): Promise<void> => {
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    await Promise.all(
        files.map(async (file) => {
            const ext = file.name.split('.').pop() ?? 'jpg'
            const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
            const filePath = `reviews/${placeId}/${user.id}/${uniqueName}`

            // 1. Storage 업로드
            const { data: uploadData, error: uploadError } =
                await supabase.storage.from(BUCKET).upload(filePath, file)
            if (uploadError) throw new Error(uploadError.message)

            // 2. 업로드된 실제 path로 Public URL 취득
            const {
                data: { publicUrl },
            } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path)

            // 3. place_images 테이블에 insert (RLS: 인증된 사용자 본인만 가능)
            const { error: insertError } = await supabase
                .from('place_images')
                .insert({
                    place_id: placeId,
                    user_id: user.id,
                    image_url: publicUrl,
                })
            if (insertError) throw new Error(insertError.message)
        }),
    )
}

const deletePlaceImagesByIds = async (ids: string[]): Promise<void> => {
    if (ids.length === 0) return
    const { error } = await supabase.from('place_images').delete().in('id', ids)
    if (error) throw new Error(error.message)
}

export const useReviewForm = (place: Place, onReviewAdded: () => void) => {
    const [ratings, setRatings] = useState<Record<string, number>>({})
    const [revisit, setRevisit] = useState(true)
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')

    const [newImageFiles, setNewImageFiles] = useState<File[]>([])
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
    const [pendingRemoveExistingIds, setPendingRemoveExistingIds] = useState<
        Set<string>
    >(() => new Set())

    const queryClient = useQueryClient()

    const resetImageDraftState = useCallback(() => {
        setPendingRemoveExistingIds(new Set())
        setNewImageFiles([])
        setNewImagePreviews((prev) => {
            prev.forEach((u) => URL.revokeObjectURL(u))
            return []
        })
    }, [])

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
        }
    }, [myReview])

    useEffect(() => {
        resetImageDraftState()
    }, [place.id, resetImageDraftState])

    const placeHasNoImages = (place.images ?? []).length === 0

    const mineImagesAll = (place.images ?? []).filter((img) => img.isMine)
    /** X로 제거 예정 처리된 사진은 화면·슬롯에서 제외 (저장 시 DB 삭제) */
    const existingMyPlaceImages = mineImagesAll.filter(
        (img) => !img.id || !pendingRemoveExistingIds.has(img.id),
    )

    /** 내가 이 장소에 이미 등록한 사진 + 새로 고른 파일 (슬롯은 본인 사진만) */
    const totalImageCount = existingMyPlaceImages.length + newImageFiles.length

    const markExistingImageRemoved = (imageId: string) => {
        setPendingRemoveExistingIds((prev) => new Set(prev).add(imageId))
    }

    const addImages = (files: FileList) => {
        const remaining = MAX_IMAGES - totalImageCount
        if (remaining <= 0) return

        const toAdd = Array.from(files).slice(0, remaining)
        const previews = toAdd.map((f) => URL.createObjectURL(f))
        setNewImageFiles((prev) => [...prev, ...toAdd])
        setNewImagePreviews((prev) => [...prev, ...previews])
    }

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(newImagePreviews[index])
        setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const handleRatingChange = (field: string, value: number) => {
        setRatings((prev) => ({ ...prev, [field]: value }))
    }

    const computeAverageRating = (ratingMap: Record<string, number>) => {
        const values = Object.values(ratingMap)
        if (values.length === 0) return 0
        return parseFloat(
            (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
        )
    }

    const isFirstSubmission = !myReview

    type MutationVars = {
        snapshotRatings: Record<string, number>
        snapshotRevisit: boolean
        snapshotComment: string
        snapshotNewFiles: File[]
        snapshotRemovedExistingIds: string[]
    }

    const { mutate, isPending } = useMutation({
        mutationFn: async (vars: MutationVars) => {
            await addReview({
                placeId: place.id,
                ratings: vars.snapshotRatings,
                revisit: vars.snapshotRevisit,
                comment: vars.snapshotComment,
                rating: computeAverageRating(vars.snapshotRatings),
            })
            await deletePlaceImagesByIds(vars.snapshotRemovedExistingIds)
            if (vars.snapshotNewFiles.length > 0) {
                await uploadAndSavePlaceImages(vars.snapshotNewFiles, place.id)
            }
        },
        onSuccess: () => {
            resetImageDraftState()
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
        if (placeHasNoImages && totalImageCount < 1) {
            setError('이 장소에는 아직 사진이 없어요. 사진을 추가해 주세요.')
            return
        }
        mutate({
            snapshotRatings: ratings,
            snapshotRevisit: revisit,
            snapshotComment: comment,
            snapshotNewFiles: newImageFiles,
            snapshotRemovedExistingIds: Array.from(pendingRemoveExistingIds),
        })
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
        getAverageRating: () =>
            formatRatingDisplay(computeAverageRating(ratings)),
        handleSubmit,
        existingMyPlaceImages,
        newImagePreviews,
        totalImageCount,
        maxImages: MAX_IMAGES,
        addImages,
        removeNewImage,
        markExistingImageRemoved,
        resetImageDraftState,
        requirePhotoWhenPlaceHasNoImages: placeHasNoImages,
    }
}
