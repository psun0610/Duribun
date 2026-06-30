import { redirect } from 'next/navigation'

import { CoupleDisconnectPending } from '@/components/CoupleDisconnectPending'
import { ProtectedSpace } from '@/components/ProtectedSpace'
import type { CoupleSummary } from '@/features/couple/types/coupleOnboarding.types'
import { getFriendCoupleFilters } from '@/features/friend/actions'
import { getCouplePlaces } from '@/features/place/actions'
import { getCouplePlaceReviewDetailsMap } from '@/features/review/actions'
import { getFriendCouplePlaceSummaries } from '@/features/share/actions'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface ProtectedAppPageProps {
    searchParams?: Promise<{
        disconnectError?: string
    }>
}

const ProtectedAppPage = async ({ searchParams }: ProtectedAppPageProps) => {
    const resolvedSearchParams = await searchParams
    const supabase = await createServerSupabaseClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

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

    const { count: memberCount } = await supabase
        .from('couple_members')
        .select('user_id', { count: 'exact', head: true })
        .eq('couple_id', couple.id)

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

        return (
            <CoupleDisconnectPending
                coupleName={coupleSummary.name}
                deleteAfter={couple.delete_after}
                errorMessage={resolvedSearchParams?.disconnectError}
                requestedAt={couple.disconnect_requested_at}
            />
        )
    }

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

    return (
        <ProtectedSpace
            coupleName={coupleSummary.name}
            currentUserId={user.id}
            friendCode={coupleSummary.friendCode}
            friendCouples={friendCouples}
            friendRecommendations={friendRecommendations}
            places={places}
            reviewDetailsByPlaceId={reviewDetailsByPlaceId}
            userLabel={userLabel}
        />
    )
}

export default ProtectedAppPage
