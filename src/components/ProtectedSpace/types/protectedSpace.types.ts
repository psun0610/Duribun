import type { CouplePlaceListItem } from '@/features/place/types/placeRegistration.types'
import type { CouplePlaceReviewDetail } from '@/features/review/types/reviewDetail.types'
import type { PublicCouplePlaceSummary } from '@/features/share/types/shareSummary.types'
import type { FriendCoupleFilterSummary } from '@/features/friend/types/friendRelationship.types'

export interface ProtectedSpaceProps {
    coupleName: string
    currentUserId: string
    friendCode: string
    friendCouples: FriendCoupleFilterSummary[]
    friendRecommendations: PublicCouplePlaceSummary[]
    places: CouplePlaceListItem[]
    reviewDetailsByPlaceId: Record<string, CouplePlaceReviewDetail>
    userLabel: string
}
