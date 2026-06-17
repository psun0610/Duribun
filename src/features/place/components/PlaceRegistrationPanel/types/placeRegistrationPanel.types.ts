import type {
    CouplePlaceListItem,
    KakaoPlaceSearchResult,
    PlaceRegistrationState,
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

export interface ConfirmPlaceBarProps {
    confirmedPlace: KakaoPlaceSearchResult
    isRegisteringKakaoPlace: boolean
    kakaoRegistrationState: PlaceRegistrationState
    onClearSelectedPlace: () => void
    registerKakaoAction: (formData: FormData) => void
}

export interface ManualPlaceFormProps {
    isRegisteringManualPlace: boolean
    manualRegistrationState: PlaceRegistrationState
    registerManualAction: (formData: FormData) => void
}

export interface UsePlaceRegistrationPanelParams {
    hasKakaoRegistrationSucceeded: boolean
    hasManualRegistrationSucceeded: boolean
    onClose: () => void
}
