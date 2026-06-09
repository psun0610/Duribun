'use server'

import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

import type { ProfileFormState } from '@/features/profile/types/profileAction.types'
import { getKakaoAccountEmail } from '@/features/profile/utils/profileMetadata.utils'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const MAX_AVATAR_SIZE = 5 * 1024 * 1024
const PROFILE_AVATAR_BUCKET = 'profile-avatars'

const normalizeRequiredText = (value: FormDataEntryValue | null) => {
    if (typeof value !== 'string') {
        return ''
    }

    return value.trim()
}

const getProfileEmail = ({
    formData,
    user,
}: {
    formData: FormData
    user: User
}) => {
    const submittedEmail = normalizeRequiredText(formData.get('email'))
    const kakaoAccountEmail = getKakaoAccountEmail({
        appMetadata: user.app_metadata,
        userEmail: user.email ?? null,
        userMetadata: user.user_metadata,
    })

    return kakaoAccountEmail || submittedEmail
}

const getAuthenticatedUser = async () => {
    const supabase = await createServerSupabaseClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return {
        supabase,
        user,
    }
}

const getAvatarFileExtension = (file: File) => {
    const extensionFromName = file.name.split('.').pop()?.toLowerCase()

    if (extensionFromName) {
        return extensionFromName
    }

    return file.type.split('/').pop() || 'jpg'
}

export const saveProfileWithAvatar = async (
    previousState: ProfileFormState,
    formData: FormData
): Promise<ProfileFormState> => {
    const { supabase, user } = await getAuthenticatedUser()
    const email = getProfileEmail({ formData, user })
    const displayName = normalizeRequiredText(formData.get('displayName'))
    const avatarFile = formData.get('avatarFile')

    if (!email) {
        return {
            ...previousState,
            errorMessage: '이메일을 입력해 주세요.',
        }
    }

    if (!displayName) {
        return {
            ...previousState,
            errorMessage: '닉네임을 입력해 주세요.',
        }
    }

    if (!(avatarFile instanceof File) || avatarFile.size === 0) {
        if (!previousState.avatarUrl) {
            return {
                ...previousState,
                errorMessage: '프로필 사진을 선택해 주세요.',
            }
        }

        const { error } = await supabase.from('profiles').upsert({
            id: user.id,
            email,
            display_name: displayName,
            avatar_url: previousState.avatarUrl,
        })

        if (error) {
            return {
                ...previousState,
                errorMessage:
                    '프로필을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.',
            }
        }

        redirect('/app')
    }

    if (!avatarFile.type.startsWith('image/')) {
        return {
            ...previousState,
            errorMessage: '이미지 파일만 선택할 수 있어요.',
        }
    }

    if (avatarFile.size > MAX_AVATAR_SIZE) {
        return {
            ...previousState,
            errorMessage: '프로필 사진은 5MB 이하로 선택해 주세요.',
        }
    }

    const extension = getAvatarFileExtension(avatarFile)
    const storagePath = `${user.id}/avatar-${Date.now()}.${extension}`
    const { error: uploadError } = await supabase.storage
        .from(PROFILE_AVATAR_BUCKET)
        .upload(storagePath, avatarFile, {
            contentType: avatarFile.type,
            upsert: true,
        })

    if (uploadError) {
        return {
            ...previousState,
            errorMessage: '프로필 사진을 업로드하지 못했어요. 다시 시도해 주세요.',
        }
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from(PROFILE_AVATAR_BUCKET).getPublicUrl(storagePath)

    const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        email,
        display_name: displayName,
        avatar_url: publicUrl,
    })

    if (profileError) {
        return {
            avatarUrl: publicUrl,
            errorMessage:
                '프로필을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.',
        }
    }

    redirect('/app')
}
