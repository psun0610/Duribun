'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createServerSupabaseClient } from '@/lib/supabase/server'

import type {
    FriendActionState,
    FriendCoupleFilterSummary,
} from './types/friendRelationship.types'

const normalizeText = (value: FormDataEntryValue | null) => {
    if (typeof value !== 'string') {
        return ''
    }

    return value.trim()
}

const mapFriendErrorMessage = (message?: string, code?: string) => {
    if (!message) {
        return '친구를 더하지 못했어요. 다시 해볼까요?'
    }

    if (message.includes('Active couple required')) {
        return '활성 커플만 친구 코드를 사용할 수 있어요.'
    }

    if (message.includes('Invalid friend code')) {
        return '이 친구 코드는 안 맞는 것 같아요. 다시 확인해 주세요.'
    }

    if (message.includes('Cannot add own couple as friend')) {
        return '우리 코드예요. 친구에게 받은 코드를 넣어주세요.'
    }

    if (message.includes('permission denied')) {
        return '지금은 처리할 수 없어요. 잠시 뒤에 다시 해주세요.'
    }

    if (
        code === '42883' ||
        message.includes('function') ||
        message.includes('schema cache')
    ) {
        return '지금은 처리할 수 없어요. 잠시 뒤에 다시 해주세요.'
    }

    return `친구 커플 연결을 완료하지 못했어요. (${code ?? 'unknown'})`
}

export const addFriendCoupleByCode = async (
    previousState: FriendActionState,
    formData: FormData
): Promise<FriendActionState> => {
    const friendCode = normalizeText(formData.get('friendCode')).toUpperCase()

    if (!friendCode) {
        return {
            ...previousState,
            errorMessage: '친구 코드를 넣어주세요.',
            succeeded: false,
        }
    }

    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.rpc('create_friendship_by_friend_code', {
        p_friend_code: friendCode,
    })

    if (error) {
        console.error('Failed to add friend couple', {
            code: error.code,
            message: error.message,
        })

        return {
            ...previousState,
            errorMessage: mapFriendErrorMessage(error.message, error.code),
            succeeded: false,
        }
    }

    revalidatePath('/app', 'layout')

    return {
        errorMessage: '',
        succeeded: true,
    }
}

export const regenerateFriendCode = async (
    previousState: FriendActionState
): Promise<FriendActionState> => {
    const supabase = await createServerSupabaseClient()
    const { data: friendCode, error } = await supabase.rpc(
        'regenerate_friend_code'
    )

    if (error || !friendCode) {
        if (error) {
            console.error('Failed to regenerate friend code', {
                code: error.code,
                message: error.message,
            })
        }

        return {
            ...previousState,
            errorMessage: mapFriendErrorMessage(error?.message, error?.code),
            succeeded: false,
        }
    }

    revalidatePath('/app', 'layout')

    return {
        errorMessage: '',
        friendCode,
        succeeded: true,
    }
}

export const updateFriendCoupleFilter = async (formData: FormData) => {
    const friendCoupleId = normalizeText(formData.get('friendCoupleId'))
    const enabled = normalizeText(formData.get('enabled')) === 'true'
    const supabase = await createServerSupabaseClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    if (!friendCoupleId) {
        return
    }

    const { error } = await supabase.from('friend_couple_filters').upsert(
        {
            enabled,
            friend_couple_id: friendCoupleId,
            user_id: user.id,
        },
        {
            onConflict: 'user_id,friend_couple_id',
        }
    )

    if (error) {
        console.error('Failed to update friend couple filter', {
            code: error.code,
            message: error.message,
        })
    }

    revalidatePath('/app', 'layout')
}

export const getFriendCoupleFilters = async (): Promise<
    FriendCoupleFilterSummary[]
> => {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from('friend_couple_filter_summaries')
        .select('enabled, friend_couple_id, friend_couple_name')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Failed to load friend couple filters', {
            code: error.code,
            message: error.message,
        })

        return []
    }

    return (data ?? []).map(row => ({
        enabled: row.enabled,
        friendCoupleId: row.friend_couple_id,
        friendCoupleName: row.friend_couple_name,
    }))
}
