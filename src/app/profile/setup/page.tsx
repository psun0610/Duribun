import { redirect } from 'next/navigation'

import { ProfileSetupForm } from '@/features/profile/components/ProfileSetupForm'
import { getProfileInitialValues } from '@/features/profile/utils/profileMetadata.utils'
import { createServerSupabaseClient, getServerUser } from '@/lib/supabase/server'

interface ProfileSetupPageProps {
    searchParams: Promise<{
        edit?: string
    }>
}

const ProfileSetupPage = async ({ searchParams }: ProfileSetupPageProps) => {
    const supabase = await createServerSupabaseClient()
    const resolvedSearchParams = await searchParams
    const user = await getServerUser(supabase)

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('email, display_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

    if (profile && resolvedSearchParams.edit !== '1') {
        redirect('/app')
    }

    const initialValues = getProfileInitialValues({
        appMetadata: user.app_metadata,
        profile,
        userEmail: user.email ?? null,
        userMetadata: user.user_metadata,
    })

    return <ProfileSetupForm initialValues={initialValues} />
}

export default ProfileSetupPage
