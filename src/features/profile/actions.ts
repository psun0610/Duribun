'use server'

import { redirect } from 'next/navigation'

import { createServerSupabaseClient } from '@/lib/supabase/server'

const normalizeRequiredText = (value: FormDataEntryValue | null) => {
    if (typeof value !== 'string') {
        return ''
    }

    return value.trim()
}

export const saveProfile = async (formData: FormData) => {
    const email = normalizeRequiredText(formData.get('email'))
    const displayName = normalizeRequiredText(formData.get('displayName'))
    const avatarUrl = normalizeRequiredText(formData.get('avatarUrl'))

    if (!email || !displayName) {
        throw new Error('이메일과 닉네임을 입력해 주세요.')
    }

    const supabase = await createServerSupabaseClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
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
