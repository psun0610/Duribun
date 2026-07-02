'use client'

import { useRouter } from 'next/navigation'

import { ReviewDetailPanel } from '@/features/review/components/ReviewDetailPanel'
import type { CouplePlaceReviewDetail } from '@/features/review/types/reviewDetail.types'
import type { ReviewDetailTargetPlace } from '@/features/place/components/CouplePlaceApp/types/couplePlaceApp.types'

interface ReviewDetailRoutePanelProps {
    currentUserId: string
    detail: CouplePlaceReviewDetail | null
    place: ReviewDetailTargetPlace
}

export const ReviewDetailRoutePanel = ({
    currentUserId,
    detail,
    place,
}: ReviewDetailRoutePanelProps) => {
    const router = useRouter()

    return (
        <ReviewDetailPanel
            currentUserId={currentUserId}
            detail={detail}
            onClose={() => router.back()}
            place={place}
        />
    )
}
