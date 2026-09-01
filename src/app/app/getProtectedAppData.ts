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
    getServerUserId,
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
    // 미들웨어가 이미 세션을 갱신했습니다. 여기서는 네트워크 없이 검증만 합니다.
    const userId = await getServerUserId(supabase)

    if (!userId) {
        redirect('/login')
    }

    // couples의 RLS가 is_couple_member_any_status라, 필터 없이 조회하면
    // 내 커플 한 건만 돌아옵니다. 소속을 따로 물어볼 필요가 없습니다.
    // 예전에는 프로필 → 소속 → 커플을 차례로 물어 왕복이 두 번 쌓였습니다.
    const [{ data: profile }, { data: couple }] = await Promise.all([
        supabase
            .from('profiles')
            .select('display_name, email')
            .eq('id', userId)
            .maybeSingle(),
        supabase
            .from('couples')
            .select(
                'id, name, invite_code, friend_code, status, disconnect_requested_at, delete_after'
            )
            .maybeSingle(),
    ])

    if (!profile) {
        redirect('/profile/setup')
    }

    if (!couple) {
        redirect('/couple/connect')
    }

    const userLabel = profile.display_name || profile.email
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

    // 서로 의존하지 않습니다. 한 번에 보냅니다.
    // 인원 수는 따로 세지 않습니다. 이 뷰가 돌려주는 행 수가 곧 인원입니다.
    const [memberProfilesResult, places, friendCouples] = await Promise.all([
        supabase.from('couple_member_profiles').select('display_name, is_me'),
        wantsPlaces ? getCouplePlaces(couple.id) : EMPTY_SECTIONS.places,
        wantsFriends ? getFriendCoupleFilters() : EMPTY_SECTIONS.friendCouples,
    ])

    const memberProfiles = memberProfilesResult.data

    if ((memberProfiles?.length ?? 0) < 2) {
        redirect('/couple/connect')
    }

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
                  userId
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
            currentUserId: userId,
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
