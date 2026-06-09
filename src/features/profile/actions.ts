'use server'

import { redirect } from 'next/navigation'

import { getKakaoAccountEmail } from '@/features/profile/utils/profileMetadata.utils'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const normalizeRequiredText = (value: FormDataEntryValue | null) => {
    if (typeof value !== 'string') {
        return ''
    }

    return value.trim()
}

export const saveProfile = async (formData: FormData) => {
    const submittedEmail = normalizeRequiredText(formData.get('email'))
    const displayName = normalizeRequiredText(formData.get('displayName'))
    const avatarUrl = normalizeRequiredText(formData.get('avatarUrl'))

    const supabase = await createServerSupabaseClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const kakaoAccountEmail = getKakaoAccountEmail({
        appMetadata: user.app_metadata,
        userEmail: user.email ?? null,
        userMetadata: user.user_metadata,
    })
    const email = kakaoAccountEmail || submittedEmail

    if (!email || !displayName) {
        throw new Error('이메일과 닉네임을 입력해 주세요.')
    }

    const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email,
        display_name: displayName,
        avatar_url: avatarUrl || null,
    })

    if (error) {
        throw error
    }

    redirect('/app')
}
