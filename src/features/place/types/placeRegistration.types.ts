import type { Database } from '@/types/database'

export type PlaceCategory = Database['public']['Enums']['place_category']

export interface KakaoPlaceSearchResult {
    address: string
    category: PlaceCategory
    id: string
    latitude: number | null
    longitude: number | null
    name: string
    placeUrl: string
    providerCategoryName: string
    roadAddress: string
}

export interface PlaceSearchState {
    errorMessage: string
    isEnd: boolean
    page: number
    query: string
    results: KakaoPlaceSearchResult[]
}

export interface PlaceRegistrationState {
    errorMessage: string
    succeeded: boolean
}

export interface PlaceSharingState {
    errorMessage: string
}

export interface CouplePlaceListItem {
    address: string
    category: PlaceCategory
    couplePlaceId: string
    isExploreApproved: boolean
    isPublic: boolean
    name: string
    provider: Database['public']['Enums']['place_provider']
    providerCategoryName: string
    roadAddress: string
}
