import { redirect } from 'next/navigation'

import { ProfileSetupForm } from '@/components/ProfileSetupForm'
import { getProfileInitialValues } from '@/features/profile/utils/profileMetadata.utils'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const ProfileSetupPage = async () => {
    const supabase = await createServerSupabaseClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('email, display_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

    const initialValues = getProfileInitialValues({
        appMetadata: user.app_metadata,
        profile,
        userEmail: user.email ?? null,
        userMetadata: user.user_metadata,
    })

    return <ProfileSetupForm initialValues={initialValues} />
}

export default ProfileSetupPage
