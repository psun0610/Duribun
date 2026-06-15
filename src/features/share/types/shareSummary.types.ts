import type { Database } from '@/types/database'

export interface PublicCouplePlaceSummary {
    averageRating: number
    category: Database['public']['Enums']['place_category']
    coupleName: string
    couplePlaceId: string
    photos: string[]
    placeName: string
    tags: string[]
}

