import { redirect } from 'next/navigation'

import { CoupleOnboarding } from '@/features/couple/components/CoupleOnboarding'
import type { CoupleSummary } from '@/features/couple/types/coupleOnboarding.types'
import { createServerSupabaseClient, getServerUser } from '@/lib/supabase/server'

const CoupleConnectPage = async () => {
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
        return <CoupleOnboarding initialCouple={null} userLabel={userLabel} />
    }

    const { data: couple } = await supabase
        .from('couples')
        .select('id, name, invite_code, friend_code, status')
        .eq('id', membership.couple_id)
        .maybeSingle()

    if (!couple) {
        return <CoupleOnboarding initialCouple={null} userLabel={userLabel} />
    }

    if (couple.status === 'disconnect_pending') {
        redirect('/app')
    }

    const { count: memberCount } = await supabase
        .from('couple_members')
        .select('user_id', { count: 'exact', head: true })
        .eq('couple_id', couple.id)

    if ((memberCount ?? 0) >= 2) {
        redirect('/app')
    }

    const coupleSummary: CoupleSummary = {
        friendCode: couple.friend_code,
        id: couple.id,
        inviteCode: couple.invite_code,
        name: couple.name,
    }

    return (
        <CoupleOnboarding
            initialCouple={coupleSummary}
            userLabel={userLabel}
        />
    )
}

export default CoupleConnectPage
