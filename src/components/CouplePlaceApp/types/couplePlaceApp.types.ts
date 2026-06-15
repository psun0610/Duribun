import type { CouplePlaceListItem } from '@/features/place/types/placeRegistration.types'

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
    places: CouplePlaceListItem[]
    userLabel: string
}
