import type {
    CouplePlaceListItem,
    KakaoPlaceSearchResult,
} from '@/features/place/types/placeRegistration.types'

export interface PlaceRegistrationPanelProps {
    onClose: () => void
}

export interface KakaoPlaceResultCardProps {
    isSelected: boolean
    onSelect: (place: KakaoPlaceSearchResult) => void
    place: KakaoPlaceSearchResult
}

export interface RegisteredPlaceListProps {
    places: CouplePlaceListItem[]
}

export interface UsePlaceRegistrationPanelParams {
    hasKakaoRegistrationSucceeded: boolean
    hasManualRegistrationSucceeded: boolean
    onClose: () => void
}
