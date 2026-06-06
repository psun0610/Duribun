import { redirect } from 'next/navigation'

import { ProtectedSpace } from '@/components/ProtectedSpace'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const ProtectedAppPage = async () => {
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

    return <ProtectedSpace userLabel={profile.display_name || profile.email} />
}

export default ProtectedAppPage
