'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

import type {
    PublicCouplePlaceSummary,
    PublicSummaryFilters,
} from './types/shareSummary.types'

const REVIEW_PHOTOS_BUCKET = 'review-photos'

interface PublicSummaryRow {
    address: string | null
    average_rating: number | null
    category: PublicCouplePlaceSummary['category']
    couple_name: string
    couple_place_id: string
    place_name: string
    public_photo_paths: string[] | null
    review_count: number | null
    road_address: string | null
    tags: string[] | null
    updated_at: string | null
}

const PUBLIC_SUMMARY_SELECT =
    'address, average_rating, category, couple_name, couple_place_id, place_name, public_photo_paths, review_count, road_address, tags, updated_at'

const mapPublicSummaryRows = async (
    rows: PublicSummaryRow[]
): Promise<PublicCouplePlaceSummary[]> => {
    const supabase = await createServerSupabaseClient()

    return Promise.all(
        rows.map(async row => {
            const photos = await Promise.all(
                (row.public_photo_paths ?? []).map(async storagePath => {
                    const { data } = await supabase.storage
                        .from(REVIEW_PHOTOS_BUCKET)
                        .createSignedUrl(storagePath, 60 * 60)

                    return data?.signedUrl ?? ''
                })
            )

            return {
                address: row.address ?? '',
                averageRating: Number(row.average_rating ?? 0),
                category: row.category,
                coupleName: row.couple_name,
                couplePlaceId: row.couple_place_id,
                photos: photos.filter(Boolean),
                placeName: row.place_name,
                reviewCount: row.review_count ?? 0,
                roadAddress: row.road_address ?? '',
                tags: row.tags ?? [],
                updatedAt: row.updated_at ?? '',
            }
        })
    )
}

export const getFriendCouplePlaceSummaries = async () => {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from('friend_couple_place_summaries')
        .select(PUBLIC_SUMMARY_SELECT)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Failed to load friend couple place summaries', {
            code: error.code,
            message: error.message,
        })

        return []
    }

    return mapPublicSummaryRows((data ?? []) as PublicSummaryRow[])
}

export const getExploreCouplePlaceSummaries = async (
    filters: PublicSummaryFilters = {}
) => {
    const supabase = await createServerSupabaseClient()
    let query = supabase
        .from('explore_couple_place_summaries')
        .select(PUBLIC_SUMMARY_SELECT)

    if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
    }

    if (filters.region) {
        const regionPattern = `%${filters.region}%`

        query = query.or(
            `address.ilike.${regionPattern},road_address.ilike.${regionPattern}`
        )
    }

    if (filters.sort === 'rating') {
        query = query
            .order('average_rating', { ascending: false })
            .order('updated_at', { ascending: false })
    } else if (filters.sort === 'latest') {
        query = query.order('updated_at', { ascending: false })
    } else {
        query = query
            .order('review_count', { ascending: false })
            .order('average_rating', { ascending: false })
            .order('updated_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
        console.error('Failed to load explore couple place summaries', {
            code: error.code,
            message: error.message,
        })

        return []
    }

    return mapPublicSummaryRows((data ?? []) as PublicSummaryRow[])
}
