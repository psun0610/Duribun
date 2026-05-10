export type PlaceCategory = '식당' | '카페' | '액티비티'

export interface Place {
    id: string
    name: string
    address: string
    category: PlaceCategory
    lat?: number
    lng?: number
    myReview?: Record<string, unknown>
    partnerReview?: Record<string, unknown>
    bothCompleted: boolean
}

export interface PlaceModalProps {
    onClose: () => void
    onPlaceAdded: () => void
}

export interface ReviewModalProps {
    place: Place
    onClose: () => void
    onReviewAdded: () => void
}
