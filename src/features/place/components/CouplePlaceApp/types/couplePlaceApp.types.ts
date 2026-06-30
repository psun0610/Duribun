import type { CouplePlaceListItem } from '@/features/place/types/placeRegistration.types'
import type { CouplePlaceReviewDetail } from '@/features/review/types/reviewDetail.types'
import type { PublicCouplePlaceSummary } from '@/features/share/types/shareSummary.types'
import type { FriendCoupleFilterSummary } from '@/features/friend/types/friendRelationship.types'

export type ViewMode = 'feed' | 'list'

export type ActiveTab = 'places' | 'friends' | 'explore' | 'settings'

export type ReviewStatus =
    | 'none'
    | 'waiting-partner'
    | 'partner-waiting'
    | 'complete'

export type PlaceCategory = 'restaurant' | 'cafe' | 'activity'

export interface CouplePlace {
    id: string
    name: string
    category: PlaceCategory
    photoUrl: string
    reviewStatus: ReviewStatus
    isPublic: boolean
    rating?: number
    visitDate?: string
    tags?: string[]
}

export interface CouplePlaceAppProps {
    coupleName: string
    currentUserId: string
    friendCode: string
    friendCouples: FriendCoupleFilterSummary[]
    friendRecommendations: PublicCouplePlaceSummary[]
    places: CouplePlaceListItem[]
    reviewDetailsByPlaceId: Record<string, CouplePlaceReviewDetail>
    userLabel: string
}

export interface ReviewTargetPlace {
    category: PlaceCategory
    couplePlaceId: string
    name: string
}

export interface ReviewDetailTargetPlace {
    category: PlaceCategory
    couplePlaceId: string
    isPublic: boolean
    name: string
}
