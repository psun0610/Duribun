import { redirect } from 'next/navigation'

import { LoginPanel } from '@/features/auth/components/LoginPanel'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface LoginPageProps {
    searchParams: Promise<{
        emailSent?: string
    }>
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
    const supabase = await createServerSupabaseClient()
    const resolvedSearchParams = await searchParams
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        redirect('/app')
    }

    return <LoginPanel hasEmailSent={resolvedSearchParams.emailSent === '1'} />
}

export default LoginPage
