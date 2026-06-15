'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

import type { PublicCouplePlaceSummary } from './types/shareSummary.types'

const REVIEW_PHOTOS_BUCKET = 'review-photos'

interface PublicSummaryRow {
    average_rating: number | null
    category: PublicCouplePlaceSummary['category']
    couple_name: string
    couple_place_id: string
    place_name: string
    public_photo_paths: string[] | null
    tags: string[] | null
}

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
                averageRating: Number(row.average_rating ?? 0),
                category: row.category,
                coupleName: row.couple_name,
                couplePlaceId: row.couple_place_id,
                photos: photos.filter(Boolean),
                placeName: row.place_name,
                tags: row.tags ?? [],
            }
        })
    )
}

export const getFriendCouplePlaceSummaries = async () => {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from('friend_couple_place_summaries')
        .select(
            'average_rating, category, couple_name, couple_place_id, place_name, public_photo_paths, tags'
        )
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

export const getExploreCouplePlaceSummaries = async () => {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from('explore_couple_place_summaries')
        .select(
            'average_rating, category, couple_name, couple_place_id, place_name, public_photo_paths, tags'
        )
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Failed to load explore couple place summaries', {
            code: error.code,
            message: error.message,
        })

        return []
    }

    return mapPublicSummaryRows((data ?? []) as PublicSummaryRow[])
}

