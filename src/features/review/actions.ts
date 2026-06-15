'use server'

import { revalidatePath } from 'next/cache'

import { createServerSupabaseClient } from '@/lib/supabase/server'

import type { ReviewSubmissionState } from './types/reviewSubmission.types'
import type {
    CouplePlaceReviewDetail,
    ReviewDetailItem,
    ReviewDetailPhoto,
    ReviewStatus,
} from './types/reviewDetail.types'
import {
    buildReviewPhotoInputs,
    getFileExtension,
    normalizeReviewText,
} from './utils/reviewSubmission.utils'

const REVIEW_PHOTOS_BUCKET = 'review-photos'

const INITIAL_REVIEW_STATE: ReviewSubmissionState = {
    errorMessage: '',
    successMessage: '',
}

const mapReviewErrorMessage = (message?: string, code?: string) => {
    if (!message) {
        return '리뷰를 저장하지 못했어요. 다시 시도해 주세요.'
    }

    if (message.includes('Authentication required')) {
        return '로그인 세션이 만료됐어요. 다시 로그인해 주세요.'
    }

    if (message.includes('Active couple required')) {
        return '활성 커플만 리뷰를 작성할 수 있어요.'
    }

    if (message.includes('permission denied')) {
        return '리뷰 저장 권한이 아직 적용되지 않았어요. Supabase 마이그레이션을 확인해 주세요.'
    }

    if (code === '23505' || message.includes('duplicate key')) {
        return '이미 작성한 리뷰가 있어 기존 리뷰를 수정하는 방식으로 저장됩니다.'
    }

    if (
        code === '42883' ||
        message.includes('function') ||
        message.includes('schema cache')
    ) {
        return '리뷰 관련 DB 함수가 아직 적용되지 않았어요. Supabase 마이그레이션을 확인해 주세요.'
    }

    return `리뷰를 저장하지 못했어요. (${code ?? 'unknown'})`
}

const getAuthenticatedSupabase = async () => {
    const supabase = await createServerSupabaseClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Authentication required')
    }

    return {
        supabase,
        user,
    }
}

const getReviewPhotoPath = (userId: string, reviewId: string, file: File) => {
    return `${userId}/${reviewId}/${crypto.randomUUID()}.${getFileExtension(file)}`
}

const resolveReviewStatus = (
    reviewRows: Array<{ authorId: string }>,
    currentUserId: string
): ReviewStatus => {
    if (reviewRows.length === 0) {
        return 'none'
    }

    if (reviewRows.length === 1) {
        return reviewRows[0].authorId === currentUserId
            ? 'waiting-partner'
            : 'partner-waiting'
    }

    return 'complete'
}

const parseRating = (value: FormDataEntryValue | null) => {
    const normalizedValue = normalizeReviewText(value)

    if (!normalizedValue) {
        return null
    }

    const rating = Number(normalizedValue)

    return Number.isFinite(rating) && rating >= 1 && rating <= 5
        ? rating
        : null
}

export const submitReview = async (
    previousState: ReviewSubmissionState,
    formData: FormData
): Promise<ReviewSubmissionState> => {
    try {
        const { supabase, user } = await getAuthenticatedSupabase()
        const couplePlaceId = normalizeReviewText(formData.get('couplePlaceId'))
        const rating = parseRating(formData.get('rating'))
        const oneLineReview = normalizeReviewText(formData.get('oneLineReview'))
        const selectedTags = formData
            .getAll('tagLabels')
            .filter((value): value is string => typeof value === 'string')
            .map(value => value.trim())
            .filter(Boolean)
        const photoInputs = buildReviewPhotoInputs(
            formData.getAll('photoFile'),
            formData.getAll('photoKind')
        )

        if (!couplePlaceId) {
            return {
                ...previousState,
                errorMessage: '리뷰할 장소를 선택해 주세요.',
            }
        }

        if (rating === null) {
            return {
                ...previousState,
                errorMessage: '평점은 1점에서 5점 사이로 선택해 주세요.',
            }
        }

        if (!oneLineReview) {
            return {
                ...previousState,
                errorMessage: '한 줄 리뷰를 입력해 주세요.',
            }
        }

        if (selectedTags.length === 0) {
            return {
                ...previousState,
                errorMessage: '태그를 하나 이상 선택해 주세요.',
            }
        }

        if (photoInputs.length === 0) {
            return {
                ...previousState,
                errorMessage:
                    '사진은 최소 1장 필요하고 각 사진의 유형을 선택해야 해요.',
            }
        }

        const { data: couplePlace, error: couplePlaceError } = await supabase
            .from('couple_places')
            .select('id, couple_id, place_id')
            .eq('id', couplePlaceId)
            .maybeSingle()

        if (couplePlaceError || !couplePlace) {
            return {
                ...previousState,
                errorMessage: '리뷰할 장소를 찾지 못했어요.',
            }
        }

        const { data: membership } = await supabase
            .from('couple_members')
            .select('couple_id')
            .eq('couple_id', couplePlace.couple_id)
            .eq('user_id', user.id)
            .maybeSingle()

        if (!membership) {
            return {
                ...previousState,
                errorMessage: '활성 커플만 리뷰를 작성할 수 있어요.',
            }
        }

        const { data: couple } = await supabase
            .from('couples')
            .select('status')
            .eq('id', couplePlace.couple_id)
            .maybeSingle()

        if (!couple || couple.status !== 'active') {
            return {
                ...previousState,
                errorMessage: '활성 커플만 리뷰를 작성할 수 있어요.',
            }
        }

        const { data: place } = await supabase
            .from('places')
            .select('category')
            .eq('id', couplePlace.place_id)
            .maybeSingle()

        if (!place) {
            return {
                ...previousState,
                errorMessage: '장소 정보를 찾지 못했어요.',
            }
        }

        const { data: existingReview } = await supabase
            .from('reviews')
            .select('id')
            .eq('couple_place_id', couplePlaceId)
            .eq('author_id', user.id)
            .maybeSingle()

        const { data: reviewRow, error: reviewError } = await supabase
            .from('reviews')
            .upsert(
                {
                    author_id: user.id,
                    couple_place_id: couplePlaceId,
                    one_line_review: oneLineReview,
                    rating,
                },
                {
                    onConflict: 'couple_place_id,author_id',
                }
            )
            .select('id')
            .single()

        if (reviewError || !reviewRow) {
            return {
                ...previousState,
                errorMessage: mapReviewErrorMessage(
                    reviewError?.message,
                    reviewError?.code
                ),
            }
        }

        const { data: tagRows, error: tagsError } = await supabase
            .from('tags')
            .select('id, label')
            .eq('category', place.category)
            .in('label', selectedTags)

        if (tagsError) {
            return {
                ...previousState,
                errorMessage: mapReviewErrorMessage(
                    tagsError.message,
                    tagsError.code
                ),
            }
        }

        const resolvedTagRows = tagRows ?? []

        if (resolvedTagRows.length === 0) {
            return {
                ...previousState,
                errorMessage: '선택한 태그를 찾지 못했어요.',
            }
        }

        const uploadedPhotos: Array<{
            kind: 'place_food' | 'couple_private'
            storagePath: string
        }> = []

        for (const photoInput of photoInputs) {
            const photoPath = getReviewPhotoPath(
                user.id,
                reviewRow.id,
                photoInput.file
            )

            const { error: uploadError } = await supabase.storage
                .from(REVIEW_PHOTOS_BUCKET)
                .upload(photoPath, photoInput.file, {
                    contentType: photoInput.file.type,
                    upsert: true,
                })

            if (uploadError) {
                return {
                    ...previousState,
                    errorMessage: '사진 업로드에 실패했어요. 다시 시도해 주세요.',
                }
            }

            uploadedPhotos.push({
                kind: photoInput.kind,
                storagePath: photoPath,
            })
        }

        if (existingReview?.id) {
            await supabase
                .from('review_tags')
                .delete()
                .eq('review_id', existingReview.id)
            await supabase
                .from('review_photos')
                .delete()
                .eq('review_id', existingReview.id)
        }

        const { error: reviewTagError } = await supabase
            .from('review_tags')
            .upsert(
                resolvedTagRows.map(tagRow => ({
                    review_id: reviewRow.id,
                    tag_id: tagRow.id,
                })),
                {
                    onConflict: 'review_id,tag_id',
                }
            )

        if (reviewTagError) {
            return {
                ...previousState,
                errorMessage: mapReviewErrorMessage(
                    reviewTagError.message,
                    reviewTagError.code
                ),
            }
        }

        for (const uploadedPhoto of uploadedPhotos) {
            const { error: reviewPhotoError } = await supabase
                .from('review_photos')
                .insert({
                    kind: uploadedPhoto.kind,
                    review_id: reviewRow.id,
                    storage_path: uploadedPhoto.storagePath,
                })

            if (reviewPhotoError) {
                return {
                    ...previousState,
                    errorMessage: mapReviewErrorMessage(
                        reviewPhotoError.message,
                        reviewPhotoError.code
                    ),
                }
            }
        }

        revalidatePath('/app')

        return {
            errorMessage: '',
            successMessage: '리뷰를 저장했어요.',
        }
    } catch (error) {
        if (error instanceof Error && error.message === 'Authentication required') {
            return {
                ...INITIAL_REVIEW_STATE,
                errorMessage: '로그인 세션이 필요해요.',
            }
        }

        console.error('Failed to submit review', error)

        return {
            ...previousState,
            errorMessage: '리뷰를 저장하지 못했어요. 다시 시도해 주세요.',
        }
    }
}

export const getCouplePlaceReviewDetailsMap = async (
    couplePlaceIds: string[],
    currentUserId: string
): Promise<Record<string, CouplePlaceReviewDetail>> => {
    if (couplePlaceIds.length === 0) {
        return {}
    }

    const supabase = await createServerSupabaseClient()
    const { data: reviewRows, error: reviewError } = await supabase
        .from('reviews')
        .select('id, author_id, couple_place_id, one_line_review, rating')
        .in('couple_place_id', couplePlaceIds)

    if (reviewError || !reviewRows) {
        console.error('Failed to load couple place review details', {
            code: reviewError?.code,
            message: reviewError?.message,
        })

        return {}
    }

    const reviewIds = reviewRows.map(reviewRow => reviewRow.id)

    const [tagResult, photoResult] = await Promise.all([
        reviewIds.length > 0
            ? supabase
                  .from('review_tags')
                  .select('review_id, tags(label, sort_order)')
                  .in('review_id', reviewIds)
            : Promise.resolve({ data: [], error: null }),
        reviewIds.length > 0
            ? supabase
                  .from('review_photos')
                  .select('review_id, kind, storage_path')
                  .in('review_id', reviewIds)
            : Promise.resolve({ data: [], error: null }),
    ])

    if (tagResult.error) {
        console.error('Failed to load review tags', {
            code: tagResult.error.code,
            message: tagResult.error.message,
        })
    }

    if (photoResult.error) {
        console.error('Failed to load review photos', {
            code: photoResult.error.code,
            message: photoResult.error.message,
        })
    }

    const tagsByReviewId = new Map<string, Array<{ label: string; sort_order: number }>>()

    for (const tagRow of tagResult.data ?? []) {
        const reviewId = tagRow.review_id as string
        const tag = tagRow.tags as { label?: string; sort_order?: number } | null

        if (!tag?.label) {
            continue
        }

        const nextTags = tagsByReviewId.get(reviewId) ?? []
        nextTags.push({
            label: tag.label,
            sort_order: tag.sort_order ?? 0,
        })
        tagsByReviewId.set(reviewId, nextTags)
    }

    const photosByReviewId = new Map<string, ReviewDetailPhoto[]>()

    for (const photoRow of photoResult.data ?? []) {
        const { data: signedUrlResult, error: signedUrlError } =
            await supabase.storage
                .from('review-photos')
                .createSignedUrl(photoRow.storage_path as string, 60 * 60)

        if (signedUrlError || !signedUrlResult?.signedUrl) {
            continue
        }

        const reviewId = photoRow.review_id as string
        const nextPhotos = photosByReviewId.get(reviewId) ?? []
        nextPhotos.push({
            kind: photoRow.kind as ReviewDetailPhoto['kind'],
            signedUrl: signedUrlResult.signedUrl,
            storagePath: photoRow.storage_path as string,
        })
        photosByReviewId.set(reviewId, nextPhotos)
    }

    const reviewsByPlaceId = new Map<string, ReviewDetailItem[]>()

    for (const reviewRow of reviewRows) {
        const nextReviews = reviewsByPlaceId.get(reviewRow.couple_place_id) ?? []
        const sortedTags = (tagsByReviewId.get(reviewRow.id) ?? []).sort(
            (left, right) => left.sort_order - right.sort_order
        )

        nextReviews.push({
            authorId: reviewRow.author_id,
            id: reviewRow.id,
            oneLineReview: reviewRow.one_line_review,
            photos: photosByReviewId.get(reviewRow.id) ?? [],
            rating: Number(reviewRow.rating),
            tags: sortedTags.map(tagRow => tagRow.label),
        })
        reviewsByPlaceId.set(reviewRow.couple_place_id, nextReviews)
    }

    const detailMap: Record<string, CouplePlaceReviewDetail> = {}

    for (const couplePlaceId of couplePlaceIds) {
        const reviews = reviewsByPlaceId.get(couplePlaceId) ?? []

        detailMap[couplePlaceId] = {
            averageRating:
                reviews.length > 0
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) /
                      reviews.length
                    : null,
            couplePlaceId,
            reviewCount: reviews.length,
            reviewStatus: resolveReviewStatus(reviews, currentUserId),
            reviews,
        }
    }

    return detailMap
}
