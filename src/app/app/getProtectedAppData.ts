import { redirect } from 'next/navigation'

import type { CoupleSummary } from '@/features/couple/types/coupleOnboarding.types'
import { getFriendCoupleFilters } from '@/features/friend/actions'
import { getCouplePlaces } from '@/features/place/actions'
import { getCouplePlaceReviewDetailsMap } from '@/features/review/actions'
import {
    getExploreCouplePlaceSummaries,
    getFriendCouplePlaceSummaries,
} from '@/features/share/actions'
import { createServerSupabaseClient, getServerUser } from '@/lib/supabase/server'

export interface ReadyProtectedAppData {
    coupleId: string
    coupleName: string
    currentUserId: string
    exploreRecommendations: Awaited<
        ReturnType<typeof getExploreCouplePlaceSummaries>
    >
    friendCode: string
    friendCouples: Awaited<ReturnType<typeof getFriendCoupleFilters>>
    friendRecommendations: Awaited<
        ReturnType<typeof getFriendCouplePlaceSummaries>
    >
    places: Awaited<ReturnType<typeof getCouplePlaces>>
    publicPlaceCount: number
    reviewDetailsByPlaceId: Awaited<
        ReturnType<typeof getCouplePlaceReviewDetailsMap>
    >
    userLabel: string
}

export interface DisconnectPendingProtectedAppData {
    coupleName: string
    deleteAfter: string
    errorMessage?: string
    kind: 'disconnect-pending'
    requestedAt: string
}

export interface ReadyProtectedAppDataResult {
    data: ReadyProtectedAppData
    kind: 'ready'
}

export type ProtectedAppDataResult =
    | ReadyProtectedAppDataResult
    | DisconnectPendingProtectedAppData

interface ProtectedAppSearchParams {
    disconnectError?: string
}

export const getProtectedAppData = async (
    searchParams?: ProtectedAppSearchParams
): Promise<ProtectedAppDataResult> => {
    const supabase = await createServerSupabaseClient()
    const user = await getServerUser(supabase)

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, email')
        .eq('id', user.id)
        .maybeSingle()

    if (!profile) {
        redirect('/profile/setup')
    }

    const userLabel = profile.display_name || profile.email
    const { data: membership } = await supabase
        .from('couple_members')
        .select('couple_id')
        .eq('user_id', user.id)
        .maybeSingle()

    if (!membership) {
        redirect('/couple/connect')
    }

    const { data: couple } = await supabase
        .from('couples')
        .select(
            'id, name, invite_code, friend_code, status, disconnect_requested_at, delete_after'
        )
        .eq('id', membership.couple_id)
        .maybeSingle()

    if (!couple) {
        redirect('/couple/connect')
    }

    const coupleSummary: CoupleSummary = {
        friendCode: couple.friend_code,
        id: couple.id,
        inviteCode: couple.invite_code,
        name: couple.name,
    }

    if (couple.status === 'disconnect_pending') {
        if (!couple.disconnect_requested_at || !couple.delete_after) {
            redirect('/couple/connect')
        }

        return {
            coupleName: coupleSummary.name,
            deleteAfter: couple.delete_after,
            errorMessage: searchParams?.disconnectError,
            kind: 'disconnect-pending',
            requestedAt: couple.disconnect_requested_at,
        }
    }

    const { count: memberCount } = await supabase
        .from('couple_members')
        .select('user_id', { count: 'exact', head: true })
        .eq('couple_id', couple.id)

    if ((memberCount ?? 0) < 2) {
        redirect('/couple/connect')
    }

    const places = await getCouplePlaces(couple.id)
    const reviewDetailsByPlaceId = await getCouplePlaceReviewDetailsMap(
        places.map(place => place.couplePlaceId),
        user.id
    )
    const friendCouples = await getFriendCoupleFilters()
    const friendRecommendations = await getFriendCouplePlaceSummaries()
    const exploreRecommendations = await getExploreCouplePlaceSummaries({
        sort: 'recommended',
    })

    return {
        data: {
            coupleId: couple.id,
            coupleName: coupleSummary.name,
            currentUserId: user.id,
            exploreRecommendations,
            friendCode: coupleSummary.friendCode,
            friendCouples,
            friendRecommendations,
            places,
            publicPlaceCount: places.filter(place => place.isPublic).length,
            reviewDetailsByPlaceId,
            userLabel,
        },
        kind: 'ready',
    }
}
