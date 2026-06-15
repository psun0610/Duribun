import type { Database } from '@/types/database'

export type ReviewPhotoKind = Database['public']['Enums']['photo_kind']
export type ReviewStatus =
    | 'none'
    | 'waiting-partner'
    | 'partner-waiting'
    | 'complete'

export interface ReviewDetailPhoto {
    kind: ReviewPhotoKind
    signedUrl: string
    storagePath: string
}

export interface ReviewDetailItem {
    authorId: string
    id: string
    oneLineReview: string
    photos: ReviewDetailPhoto[]
    rating: number
    tags: string[]
}

export interface CouplePlaceReviewDetail {
    averageRating: number | null
    couplePlaceId: string
    reviewCount: number
    reviewStatus: ReviewStatus
    reviews: ReviewDetailItem[]
}
