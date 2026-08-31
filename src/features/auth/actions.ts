'use server'

import { redirect } from 'next/navigation'
import type { Provider } from '@supabase/supabase-js'
import { getSiteUrl } from '@/lib/env'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { normalizeInternalRedirectPath } from '@/features/auth/routing'

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

const parseNextPath = (value: FormDataEntryValue | null) => {
    if (typeof value !== 'string') {
        return '/app'
    }

    return normalizeInternalRedirectPath(value, '/app')
}

/**
 * OAuth 콜백 주소는 요청의 origin 헤더가 아니라 설정된 사이트 주소로 고정합니다.
 * 카카오톡 인앱 브라우저처럼 origin이 비거나 다르게 오는 환경에서는
 * Supabase 허용 목록과 어긋나 로그인이 카카오 화면으로 되돌아갑니다.
 */
const buildCallbackUrl = (nextPath: string) => {
    return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(nextPath)}`
}

const parseProvider = (value: FormDataEntryValue | null): SupportedProvider => {
    if (value === 'kakao' || value === 'naver' || value === 'google') {
        return value
    }

    throw new Error('Unsupported auth provider')
}

export const signInWithProvider = async (formData: FormData) => {
    const selectedProvider = parseProvider(formData.get('provider'))
    const nextPath = parseNextPath(formData.get('next'))
    const provider = providerMap[selectedProvider] as Provider
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: buildCallbackUrl(nextPath),
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
    const nextPath = parseNextPath(formData.get('next'))

    if (!email) {
        throw new Error('이메일을 입력해 주세요.')
    }

    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: buildCallbackUrl(nextPath),
            shouldCreateUser: true,
        },
    })

    if (error) {
        throw error
    }

    redirect(`/login?emailSent=1&next=${encodeURIComponent(nextPath)}`)
}

export const signOut = async () => {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    redirect('/login')
}
