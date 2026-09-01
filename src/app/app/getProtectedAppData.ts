import { redirect } from 'next/navigation'

import type { CoupleSummary } from '@/features/couple/types/coupleOnboarding.types'
import { getFriendCoupleFilters } from '@/features/friend/actions'
import { getCouplePlaces } from '@/features/place/actions'
import { getCouplePlaceReviewDetailsMap } from '@/features/review/actions'
import {
    getExploreCouplePlaceSummaries,
    getFriendCouplePlaceSummaries,
} from '@/features/share/actions'
import {
    createServerSupabaseClient,
    getServerUser,
} from '@/lib/supabase/server'

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
    myName: string
    partnerName: string
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
    ReadyProtectedAppDataResult | DisconnectPendingProtectedAppData

/**
 * 탭마다 쓰는 데이터가 다릅니다. 전부 불러오면 둘러보기 탭이
 * 쓰지도 않는 장소 목록과 리뷰 상세까지 기다리게 됩니다.
 */
export type ProtectedAppDataSection = 'places' | 'friends' | 'explore'

interface ProtectedAppDataOptions {
    searchParams?: {
        disconnectError?: string
    }
    sections?: ProtectedAppDataSection[]
}

const EMPTY_SECTIONS = {
    exploreRecommendations: [],
    friendCouples: [],
    friendRecommendations: [],
    places: [],
    reviewDetailsByPlaceId: {},
} satisfies Pick<
    ReadyProtectedAppData,
    | 'exploreRecommendations'
    | 'friendCouples'
    | 'friendRecommendations'
    | 'places'
    | 'reviewDetailsByPlaceId'
>

export const getProtectedAppData = async ({
    searchParams,
    sections = ['places', 'friends', 'explore'],
}: ProtectedAppDataOptions = {}): Promise<ProtectedAppDataResult> => {
    const supabase = await createServerSupabaseClient()
    const user = await getServerUser(supabase)

    if (!user) {
        redirect('/login')
    }

    // 프로필과 커플 소속은 서로 기다릴 이유가 없습니다.
    const [{ data: profile }, { data: membership }] = await Promise.all([
        supabase
            .from('profiles')
            .select('display_name, email')
            .eq('id', user.id)
            .maybeSingle(),
        supabase
            .from('couple_members')
            .select('couple_id')
            .eq('user_id', user.id)
            .maybeSingle(),
    ])

    if (!profile) {
        redirect('/profile/setup')
    }

    if (!membership) {
        redirect('/couple/connect')
    }

    const userLabel = profile.display_name || profile.email
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

    const wantsPlaces = sections.includes('places')
    const wantsFriends = sections.includes('friends')
    const wantsExplore = sections.includes('explore')

    // 아래 넷은 서로 의존하지 않습니다. 한 번에 보냅니다.
    const [
        { count: memberCount },
        memberProfilesResult,
        places,
        friendCouples,
    ] = await Promise.all([
        supabase
            .from('couple_members')
            .select('user_id', { count: 'exact', head: true })
            .eq('couple_id', couple.id),
        // 목록 상단에 "상대 이름 ♥ 내 이름"을 보여주기 위해 두 사람 이름을 읽습니다.
        supabase.from('couple_member_profiles').select('display_name, is_me'),
        wantsPlaces ? getCouplePlaces(couple.id) : EMPTY_SECTIONS.places,
        wantsFriends ? getFriendCoupleFilters() : EMPTY_SECTIONS.friendCouples,
    ])

    if ((memberCount ?? 0) < 2) {
        redirect('/couple/connect')
    }

    const memberProfiles = memberProfilesResult.data
    const partnerName =
        memberProfiles?.find(member => !member.is_me)?.display_name ?? ''
    const myName =
        memberProfiles?.find(member => member.is_me)?.display_name ?? userLabel

    // 리뷰 상세만 장소 목록을 기다립니다. 나머지는 함께 갑니다.
    const [
        reviewDetailsByPlaceId,
        friendRecommendations,
        exploreRecommendations,
    ] = await Promise.all([
        wantsPlaces && places.length > 0
            ? getCouplePlaceReviewDetailsMap(
                  places.map(place => place.couplePlaceId),
                  user.id
              )
            : EMPTY_SECTIONS.reviewDetailsByPlaceId,
        wantsFriends
            ? getFriendCouplePlaceSummaries()
            : EMPTY_SECTIONS.friendRecommendations,
        wantsExplore
            ? getExploreCouplePlaceSummaries({ sort: 'recommended' })
            : EMPTY_SECTIONS.exploreRecommendations,
    ])

    return {
        data: {
            coupleId: couple.id,
            coupleName: coupleSummary.name,
            currentUserId: user.id,
            exploreRecommendations,
            friendCode: coupleSummary.friendCode,
            friendCouples,
            friendRecommendations,
            myName,
            partnerName,
            places,
            publicPlaceCount: places.filter(place => place.isPublic).length,
            reviewDetailsByPlaceId,
            userLabel,
        },
        kind: 'ready',
    }
}
