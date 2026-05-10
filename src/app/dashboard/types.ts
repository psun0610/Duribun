export type PlaceCategory = '식당' | '카페' | '액티비티'

export interface PlaceImage {
    id?: string
    url: string
    userId: string
    isMine: boolean
}

export interface Place {
    id: string
    name: string
    address: string
    category: PlaceCategory
    lat?: number
    lng?: number
    images: PlaceImage[]
    myReview?: Record<string, unknown>
    partnerReview?: Record<string, unknown>
    bothCompleted: boolean
}

/** 장소 목록 표시 형식 */
export type PlaceListViewMode = 'cards' | 'grid' | 'compact'

export interface PlaceModalProps {
    onClose: () => void
    onPlaceAdded: () => void
}

export interface ReviewModalProps {
    place: Place
    onClose: () => void
    onReviewAdded: () => void
}
