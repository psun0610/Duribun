'use client'

import { ReviewDetailPanel } from '@/features/review/components/ReviewDetailPanel'
import type { CouplePlaceReviewDetail } from '@/features/review/types/reviewDetail.types'
import type { ReviewDetailTargetPlace } from '@/features/place/components/CouplePlaceApp/types/couplePlaceApp.types'

import { useModalRouteClose } from './useModalRouteClose'

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
    const handleClose = useModalRouteClose('/app/places')

    return (
        <ReviewDetailPanel
            currentUserId={currentUserId}
            detail={detail}
            onClose={handleClose}
            place={place}
        />
    )
}
