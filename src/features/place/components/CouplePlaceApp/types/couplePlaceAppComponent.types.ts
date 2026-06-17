import type { LucideIcon } from 'lucide-react'

import type { CouplePlaceListItem } from '@/features/place/types/placeRegistration.types'
import type { CouplePlaceReviewDetail } from '@/features/review/types/reviewDetail.types'

import type {
    ActiveTab,
    CouplePlace,
    ReviewDetailTargetPlace,
    ViewMode,
} from './couplePlaceApp.types'

export interface AppHeaderProps {
    coupleName: string
    onFeedView: () => void
    onListView: () => void
    viewMode: ViewMode
}

export interface BottomNavigationProps {
    activeTab: ActiveTab
    onAddPlace: () => void
    onTabChange: (nextTab: ActiveTab) => void
}

export interface EmptyTabProps {
    description: string
    icon: LucideIcon
    title: string
}

export interface MockPlaceCardProps {
    place: CouplePlace
}

export interface PlacesTabPanelProps {
    onOpenReviewDetail: (place: ReviewDetailTargetPlace) => void
    places: CouplePlaceListItem[]
    reviewDetailsByPlaceId: Record<string, CouplePlaceReviewDetail>
    viewMode: ViewMode
}

export interface RegisteredPlaceCardProps {
    detail: CouplePlaceReviewDetail | undefined
    onOpenReviewDetail: (place: ReviewDetailTargetPlace) => void
    place: CouplePlaceListItem
}
