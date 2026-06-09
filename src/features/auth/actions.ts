'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Provider } from '@supabase/supabase-js'
import { getSiteUrl } from '@/lib/env'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const providerMap = {
    kakao: 'kakao',
    google: 'google',
    naver: process.env.SUPABASE_AUTH_NAVER_PROVIDER_ID ?? 'custom:naver',
} as const

type SupportedProvider = keyof typeof providerMap

const providerScopes: Partial<Record<SupportedProvider, string>> = {
    kakao: 'account_email profile_image profile_nickname',
}

const parseEmail = (value: FormDataEntryValue | null) => {
    if (typeof value !== 'string') {
        return ''
    }

    return value.trim().toLowerCase()
}

const parseProvider = (value: FormDataEntryValue | null): SupportedProvider => {
    if (value === 'kakao' || value === 'naver' || value === 'google') {
        return value
    }

    throw new Error('Unsupported auth provider')
}

export const signInWithProvider = async (formData: FormData) => {
    const selectedProvider = parseProvider(formData.get('provider'))
    const provider = providerMap[selectedProvider] as Provider
    const headerStore = await headers()
    const origin = headerStore.get('origin') ?? getSiteUrl()
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${origin}/auth/callback`,
            scopes: providerScopes[selectedProvider],
        },
    })

    if (error) {
        throw error
    }

    if (data.url) {
        redirect(data.url)
    }

    redirect('/login')
}

export const signInWithEmail = async (formData: FormData) => {
    const email = parseEmail(formData.get('email'))

    if (!email) {
        throw new Error('이메일을 입력해 주세요.')
    }

    const headerStore = await headers()
    const origin = headerStore.get('origin') ?? getSiteUrl()
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
            shouldCreateUser: true,
        },
    })

    if (error) {
        throw error
    }

    redirect('/login?emailSent=1')
}

export const signOut = async () => {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    redirect('/login')
}
