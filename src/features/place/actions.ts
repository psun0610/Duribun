'use server'

import { revalidatePath } from 'next/cache'

import { createServerSupabaseClient } from '@/lib/supabase/server'

import type {
    CouplePlaceListItem,
    KakaoPlaceSearchResult,
    PlaceCategory,
    PlaceRegistrationState,
    PlaceSearchState,
    PlaceSharingState,
} from './types/placeRegistration.types'
import {
    mapCouplePlaceRow,
    mapKakaoPlaceDocument,
} from './utils/placeRegistration.utils'

const KAKAO_LOCAL_API_BASE_URL =
    process.env.KAKAO_LOCAL_API_BASE_URL || 'https://dapi.kakao.com'
const KAKAO_SEARCH_PAGE_SIZE = 15

const EMPTY_SEARCH_STATE: PlaceSearchState = {
    errorMessage: '',
    isEnd: true,
    page: 0,
    query: '',
    results: [],
}

const normalizeText = (value: FormDataEntryValue | null) => {
    if (typeof value !== 'string') {
        return ''
    }

    return value.trim()
}

const parseCategory = (value: FormDataEntryValue | null): PlaceCategory => {
    const normalizedValue = normalizeText(value)

    if (normalizedValue === 'restaurant') {
        return normalizedValue
    }

    if (normalizedValue === 'cafe') {
        return normalizedValue
    }

    if (normalizedValue === 'activity') {
        return normalizedValue
    }

    return 'restaurant'
}

const parseNullableNumber = (value: string) => {
    if (!value) {
        return null
    }

    const parsedValue = Number(value)

    return Number.isFinite(parsedValue) ? parsedValue : null
}

const parseBoolean = (value: FormDataEntryValue | null) => {
    return normalizeText(value) === 'true'
}

const parsePage = (value: FormDataEntryValue | null) => {
    const parsedPage = Number(normalizeText(value))

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
        return 1
    }

    return parsedPage
}

const shouldAppendSearchResults = (
    previousState: PlaceSearchState,
    query: string,
    page: number,
    mode: string
) => {
    return mode === 'append' && previousState.query === query && page > 1
}

const mergeSearchResults = (
    previousResults: KakaoPlaceSearchResult[],
    nextResults: KakaoPlaceSearchResult[]
) => {
    const resultsById = new Map<string, KakaoPlaceSearchResult>()

    for (const result of previousResults) {
        resultsById.set(result.id, result)
    }

    for (const result of nextResults) {
        resultsById.set(result.id, result)
    }

    return Array.from(resultsById.values())
}

const mapKakaoSearchErrorMessage = (status: number, responseBody: string) => {
    if (responseBody.includes('disabled OPEN_MAP_AND_LOCAL service')) {
        return 'Kakao Developers에서 지도/로컬 서비스가 비활성화되어 있어요. 앱 설정에서 OPEN_MAP_AND_LOCAL 서비스를 활성화해 주세요.'
    }

    if (status === 401 || status === 403) {
        return 'Kakao Local API 권한을 확인해 주세요. REST API 키와 Kakao Developers 서비스 설정이 필요해요.'
    }

    if (status === 429) {
        return 'Kakao Local API 호출 한도를 초과했어요. 잠시 후 다시 시도해 주세요.'
    }

    return 'Kakao 장소 검색에 실패했어요. 잠시 후 다시 시도해 주세요.'
}

const mapPlaceRegistrationErrorMessage = (message?: string, code?: string) => {
    if (!message) {
        return '장소를 등록하지 못했어요. 다시 시도해 주세요.'
    }

    if (message.includes('Active couple required')) {
        return '활성 커플만 장소를 등록할 수 있어요.'
    }

    if (message.includes('Kakao provider place id required')) {
        return 'Kakao 장소 정보가 올바르지 않아요. 다시 검색해 주세요.'
    }

    if (message.includes('Manual place name required')) {
        return '장소명을 입력해 주세요.'
    }

    if (message.includes('permission denied')) {
        return '장소 등록 권한이 아직 적용되지 않았어요. Supabase 마이그레이션을 확인해 주세요.'
    }

    if (
        code === '42883' ||
        message.includes('function') ||
        message.includes('schema cache')
    ) {
        return '장소 등록 DB 함수가 아직 적용되지 않았어요. Supabase 마이그레이션을 확인해 주세요.'
    }

    return `장소를 등록하지 못했어요. (${code ?? 'unknown'})`
}

export const searchKakaoPlaces = async (
    previousState: PlaceSearchState,
    formData: FormData
): Promise<PlaceSearchState> => {
    const query = normalizeText(formData.get('query'))
    const page = parsePage(formData.get('page'))
    const mode = normalizeText(formData.get('mode'))
    const shouldAppend = shouldAppendSearchResults(
        previousState,
        query,
        page,
        mode
    )

    if (!query) {
        return EMPTY_SEARCH_STATE
    }

    const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY

    if (!kakaoRestApiKey) {
        return {
            ...EMPTY_SEARCH_STATE,
            errorMessage:
                'Kakao Local API 키가 설정되지 않았어요. KAKAO_REST_API_KEY를 확인해 주세요.',
            query,
        }
    }

    const searchUrl = new URL(
        '/v2/local/search/keyword.json',
        KAKAO_LOCAL_API_BASE_URL
    )
    searchUrl.searchParams.set('query', query)
    searchUrl.searchParams.set('page', String(page))
    searchUrl.searchParams.set('size', String(KAKAO_SEARCH_PAGE_SIZE))

    try {
        const response = await fetch(searchUrl, {
            headers: {
                Authorization: `KakaoAK ${kakaoRestApiKey}`,
            },
            next: {
                revalidate: 0,
            },
        })

        if (!response.ok) {
            const responseBody = await response.text()

            return {
                ...previousState,
                errorMessage: mapKakaoSearchErrorMessage(
                    response.status,
                    responseBody
                ),
                query,
                results: shouldAppend ? previousState.results : [],
            }
        }

        const payload = (await response.json()) as {
            documents?: unknown[]
            meta?: {
                is_end?: boolean
            }
        }
        const nextResults = (payload.documents ?? [])
            .map(document =>
                mapKakaoPlaceDocument(
                    document as Parameters<typeof mapKakaoPlaceDocument>[0]
                )
            )
            .filter((result): result is KakaoPlaceSearchResult =>
                Boolean(result)
            )
        const results = shouldAppend
            ? mergeSearchResults(previousState.results, nextResults)
            : nextResults

        return {
            errorMessage: '',
            isEnd: payload.meta?.is_end ?? true,
            page,
            query,
            results,
        }
    } catch (error) {
        console.error('Failed to search Kakao places', error)

        return {
            ...previousState,
            errorMessage: 'Kakao 장소 검색 중 오류가 발생했어요.',
            query,
            results: [],
        }
    }
}

export const registerKakaoPlace = async (
    previousState: PlaceRegistrationState,
    formData: FormData
): Promise<PlaceRegistrationState> => {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.rpc('register_kakao_couple_place', {
        p_address: normalizeText(formData.get('address')) || null,
        p_category: parseCategory(formData.get('category')),
        p_latitude: parseNullableNumber(
            normalizeText(formData.get('latitude'))
        ),
        p_longitude: parseNullableNumber(
            normalizeText(formData.get('longitude'))
        ),
        p_name: normalizeText(formData.get('name')),
        p_place_url: normalizeText(formData.get('placeUrl')) || null,
        p_provider_category_name:
            normalizeText(formData.get('providerCategoryName')) || null,
        p_provider_place_id: normalizeText(formData.get('providerPlaceId')),
        p_road_address: normalizeText(formData.get('roadAddress')) || null,
    })

    if (error) {
        console.error('Failed to register Kakao place', {
            code: error.code,
            message: error.message,
        })

        return {
            ...previousState,
            errorMessage: mapPlaceRegistrationErrorMessage(
                error.message,
                error.code
            ),
            succeeded: false,
        }
    }

    revalidatePath('/app')

    return {
        errorMessage: '',
        succeeded: true,
    }
}

export const registerManualPlace = async (
    previousState: PlaceRegistrationState,
    formData: FormData
): Promise<PlaceRegistrationState> => {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.rpc('register_manual_couple_place', {
        p_address: normalizeText(formData.get('address')) || null,
        p_category: parseCategory(formData.get('category')),
        p_name: normalizeText(formData.get('name')),
        p_road_address: normalizeText(formData.get('roadAddress')) || null,
    })

    if (error) {
        console.error('Failed to register manual place', {
            code: error.code,
            message: error.message,
        })

        return {
            ...previousState,
            errorMessage: mapPlaceRegistrationErrorMessage(
                error.message,
                error.code
            ),
            succeeded: false,
        }
    }

    revalidatePath('/app')

    return {
        errorMessage: '',
        succeeded: true,
    }
}

export const updateCouplePlaceSharing = async (
    previousState: PlaceSharingState,
    formData: FormData
): Promise<PlaceSharingState> => {
    const supabase = await createServerSupabaseClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    const couplePlaceId = normalizeText(formData.get('couplePlaceId'))
    const isPublic = parseBoolean(formData.get('isPublic'))

    if (!user) {
        return {
            ...previousState,
            errorMessage: '로그인이 필요해요.',
        }
    }

    if (!couplePlaceId) {
        return {
            ...previousState,
            errorMessage: '공유 설정을 변경할 장소를 찾지 못했어요.',
        }
    }

    const { data: couplePlace } = await supabase
        .from('couple_places')
        .select('id, couple_id')
        .eq('id', couplePlaceId)
        .maybeSingle()

    if (!couplePlace) {
        return {
            ...previousState,
            errorMessage: '공유 설정을 변경할 장소를 찾지 못했어요.',
        }
    }

    const { data: membership } = await supabase
        .from('couple_members')
        .select('couple_id')
        .eq('couple_id', couplePlace.couple_id)
        .eq('user_id', user.id)
        .maybeSingle()

    if (!membership) {
        return {
            ...previousState,
            errorMessage: '활성 커플만 공유 설정을 바꿀 수 있어요.',
        }
    }

    const { data: couple } = await supabase
        .from('couples')
        .select('status')
        .eq('id', couplePlace.couple_id)
        .maybeSingle()

    if (!couple || couple.status !== 'active') {
        return {
            ...previousState,
            errorMessage: '활성 커플만 공유 설정을 바꿀 수 있어요.',
        }
    }

    const { error } = await supabase
        .from('couple_places')
        .update({ is_public: isPublic })
        .eq('id', couplePlaceId)

    if (error) {
        console.error('Failed to update couple place sharing', {
            code: error.code,
            message: error.message,
        })

        return {
            ...previousState,
            errorMessage: '공유 설정을 저장하지 못했어요. 다시 시도해 주세요.',
        }
    }

    revalidatePath('/app')

    return {
        errorMessage: '',
    }
}

export const getCouplePlaces = async (
    coupleId: string
): Promise<CouplePlaceListItem[]> => {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from('couple_places')
        .select(
            'id, is_public, places(name, category, provider, provider_category_name, address, road_address, is_explore_approved)'
        )
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Failed to load couple places', {
            code: error.code,
            message: error.message,
        })

        return []
    }

    return (data ?? [])
        .map(row => mapCouplePlaceRow(row))
        .filter((place): place is CouplePlaceListItem => Boolean(place))
}
