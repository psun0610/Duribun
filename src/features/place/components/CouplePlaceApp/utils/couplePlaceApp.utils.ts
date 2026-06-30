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

export const getReviewStatusBadgeVariant = (
    status: ReviewStatus
): BadgeVariant => {
    if (status === 'complete') {
        return 'secondary'
    }

    if (status === 'partner-waiting') {
        return 'secondary'
    }

    if (status === 'waiting-partner') {
        return 'primary'
    }

    return 'primarySoft'
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
