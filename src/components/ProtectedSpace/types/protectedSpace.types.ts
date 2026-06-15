import type { CouplePlaceListItem } from '@/features/place/types/placeRegistration.types'
import type { CouplePlaceReviewDetail } from '@/features/review/types/reviewDetail.types'

export interface ProtectedSpaceProps {
    coupleName: string
    currentUserId: string
    places: CouplePlaceListItem[]
    reviewDetailsByPlaceId: Record<string, CouplePlaceReviewDetail>
    userLabel: string
}
