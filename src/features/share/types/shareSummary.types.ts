import type { Database } from '@/types/database'

export type PublicSummarySort = 'recommended' | 'rating' | 'latest'

export type PublicSummaryCategoryFilter =
    | 'all'
    | Database['public']['Enums']['place_category']

export interface PublicSummaryFilters {
    category?: PublicSummaryCategoryFilter
    region?: string
    sort?: PublicSummarySort
}

export interface PublicCouplePlaceSummary {
    address: string
    averageRating: number
    category: Database['public']['Enums']['place_category']
    coupleName: string
    couplePlaceId: string
    photos: string[]
    placeName: string
    reviewCount: number
    roadAddress: string
    tags: string[]
    updatedAt: string
}
