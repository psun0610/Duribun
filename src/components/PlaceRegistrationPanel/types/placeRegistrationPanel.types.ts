import type {
    CouplePlaceListItem,
    KakaoPlaceSearchResult,
} from '@/features/place/types/placeRegistration.types'

export interface PlaceRegistrationPanelProps {
    onClose: () => void
}

export interface KakaoPlaceResultCardProps {
    place: KakaoPlaceSearchResult
}

export interface RegisteredPlaceListProps {
    places: CouplePlaceListItem[]
}
