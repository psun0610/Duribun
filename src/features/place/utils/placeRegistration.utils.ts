import type {
    CouplePlaceListItem,
    KakaoPlaceSearchResult,
    PlaceCategory,
} from '../types/placeRegistration.types'

const CATEGORY_KEYWORDS: Record<PlaceCategory, string[]> = {
    activity: ['관광', '문화', '여행', '레저', '스포츠', '전시', '공연', '영화'],
    cafe: ['카페', '커피', '디저트'],
    restaurant: ['음식점', '식당', '맛집', '한식', '양식', '일식', '중식'],
}

interface KakaoLocalDocument {
    address_name?: string
    category_group_name?: string
    category_name?: string
    id?: string
    place_name?: string
    place_url?: string
    road_address_name?: string
    x?: string
    y?: string
}

interface CouplePlaceQueryRow {
    id: string
    is_public: boolean
    places: {
        address: string | null
        category: PlaceCategory
        is_explore_approved: boolean
        name: string
        provider: 'kakao' | 'manual'
        provider_category_name: string | null
        road_address: string | null
    } | null
}

const parseCoordinate = (value?: string) => {
    if (!value) {
        return null
    }

    const coordinate = Number(value)

    return Number.isFinite(coordinate) ? coordinate : null
}

export const inferPlaceCategory = (categoryName: string): PlaceCategory => {
    const normalizedCategory = categoryName.toLowerCase()

    if (
        CATEGORY_KEYWORDS.cafe.some(keyword =>
            normalizedCategory.includes(keyword)
        )
    ) {
        return 'cafe'
    }

    if (
        CATEGORY_KEYWORDS.restaurant.some(keyword =>
            normalizedCategory.includes(keyword)
        )
    ) {
        return 'restaurant'
    }

    return 'activity'
}

export const mapKakaoPlaceDocument = (
    document: KakaoLocalDocument
): KakaoPlaceSearchResult | null => {
    if (!document.id || !document.place_name) {
        return null
    }

    const providerCategoryName =
        document.category_name || document.category_group_name || ''

    return {
        address: document.address_name || '',
        category: inferPlaceCategory(providerCategoryName),
        id: document.id,
        latitude: parseCoordinate(document.y),
        longitude: parseCoordinate(document.x),
        name: document.place_name,
        placeUrl: document.place_url || '',
        providerCategoryName,
        roadAddress: document.road_address_name || '',
    }
}

export const mapCouplePlaceRow = (
    row: CouplePlaceQueryRow
): CouplePlaceListItem | null => {
    if (!row.places) {
        return null
    }

    return {
        address: row.places.address || '',
        category: row.places.category,
        couplePlaceId: row.id,
        isExploreApproved: row.places.is_explore_approved,
        isPublic: row.is_public,
        name: row.places.name,
        provider: row.places.provider,
        providerCategoryName: row.places.provider_category_name || '',
        roadAddress: row.places.road_address || '',
    }
}
