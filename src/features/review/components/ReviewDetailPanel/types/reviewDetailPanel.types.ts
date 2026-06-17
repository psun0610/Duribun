import type { ReviewDetailTargetPlace } from '@/features/place/components/CouplePlaceApp/types/couplePlaceApp.types'
import type {
    CouplePlaceReviewDetail,
    ReviewDetailItem,
} from '@/features/review/types/reviewDetail.types'

export interface ReviewDetailPanelProps {
    currentUserId: string
    detail: CouplePlaceReviewDetail | null
    onClose: () => void
    place: ReviewDetailTargetPlace
}

export interface ReviewDetailCardProps {
    currentUserId: string
    review: ReviewDetailItem
}
