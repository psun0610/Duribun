import type { CouplePlaceListItem } from '@/features/place/types/placeRegistration.types'
import type { CouplePlaceReviewDetail } from '@/features/review/types/reviewDetail.types'
import type { ReviewTargetPlace } from '@/features/review/types/reviewSubmission.types'
import type { BadgeVariant } from '@/components/ui'

import type {
    ReviewDetailTargetPlace,
    ReviewStatus,
} from '../types/couplePlaceApp.types'

export const getStatusClassName = (status: ReviewStatus) => {
    const baseClassName =
        'inline-flex self-start rounded-full px-2 py-0.5 text-[11px] font-medium'

    if (status === 'complete') {
        return `${baseClassName} bg-secondary text-foreground`
    }

    if (status === 'partner-waiting') {
        return `${baseClassName} bg-primary text-primary-foreground`
    }

    if (status === 'waiting-partner') {
        return `${baseClassName} bg-primary/20 text-primary`
    }

    return `${baseClassName} bg-muted text-muted-foreground`
}

export const getListStatusClassName = (status: ReviewStatus) => {
    const baseClassName =
        'inline-flex self-start rounded-full px-2.5 py-1 text-[11px] font-medium'

    if (status === 'complete') {
        return `${baseClassName} bg-secondary text-foreground`
    }

    if (status === 'partner-waiting') {
        return `${baseClassName} bg-primary text-primary-foreground`
    }

    if (status === 'waiting-partner') {
        return `${baseClassName} bg-primary/20 text-primary`
    }

    return `${baseClassName} bg-muted text-muted-foreground`
}

/**
 * 리뷰 상태 뱃지 색은 docs/design-system.md v2.1을 따릅니다.
 * 진행 중(내가 썼든 상대가 썼든)이면 핑크, 끝났으면 옐로, 아직이면 회색입니다.
 */
export const getReviewStatusBadgeVariant = (
    status: ReviewStatus
): BadgeVariant => {
    if (status === 'complete') {
        return 'secondary'
    }

    if (status === 'partner-waiting' || status === 'waiting-partner') {
        return 'primarySoft'
    }

    return 'muted'
}

export const formatRating = (rating: number) => {
    const rounded = Math.round(rating * 10) / 10

    return Number.isInteger(rounded) ? rounded.toFixed(1) : `${rounded}`
}

export const getRegisteredPlaceStatus = (
    detail: CouplePlaceReviewDetail | undefined
): ReviewStatus => {
    return detail?.reviewStatus ?? 'none'
}

/** 목록 카드에 보여줄 리뷰 태그입니다. 두 사람이 고른 태그를 합쳐 앞의 두 개만 씁니다. */
export const getRegisteredPlaceTags = (
    detail: CouplePlaceReviewDetail | undefined,
    limit = 2
) => {
    if (!detail) {
        return []
    }

    const uniqueTags: string[] = []

    for (const review of detail.reviews) {
        for (const tag of review.tags) {
            if (!uniqueTags.includes(tag)) {
                uniqueTags.push(tag)
            }
        }
    }

    return uniqueTags.slice(0, limit)
}

export const getRegisteredPlaceRating = (
    detail: CouplePlaceReviewDetail | undefined
) => {
    if (detail?.averageRating === null || detail?.averageRating === undefined) {
        return null
    }

    return formatRating(detail.averageRating)
}

export const getReviewDetailTargetPlace = (
    place: CouplePlaceListItem
): ReviewDetailTargetPlace => ({
    category: place.category,
    couplePlaceId: place.couplePlaceId,
    isPublic: place.isPublic,
    name: place.name,
})

export const getReviewTargetPlace = (
    place: CouplePlaceListItem
): ReviewTargetPlace => ({
    category: place.category,
    couplePlaceId: place.couplePlaceId,
    name: place.name,
})

export const getFallbackReviewDetail = (
    place: ReviewDetailTargetPlace
): CouplePlaceReviewDetail => ({
    averageRating: null,
    couplePlaceId: place.couplePlaceId,
    reviewCount: 0,
    reviewStatus: 'none',
    reviews: [],
})
