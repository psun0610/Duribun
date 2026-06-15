import type { CouplePlaceListItem } from '@/features/place/types/placeRegistration.types'

export interface ProtectedSpaceProps {
    coupleName: string
    places: CouplePlaceListItem[]
    userLabel: string
}
