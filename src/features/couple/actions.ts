'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import type {
    CoupleActionState,
    CoupleSummary,
} from '@/features/couple/types/coupleOnboarding.types'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const DEFAULT_COUPLE_NAME = '우리 커플'

const normalizeText = (value: FormDataEntryValue | null) => {
    if (typeof value !== 'string') {
        return ''
    }

    return value.trim()
}

const mapCoupleErrorMessage = (message?: string, code?: string) => {
    if (!message) {
        return '커플 연결을 완료하지 못했어요. 다시 시도해 주세요.'
    }

    if (message.includes('Authentication required')) {
        return '로그인 세션이 만료됐어요. 다시 로그인해 주세요.'
    }

    if (message.includes('already in a couple')) {
        return '이미 커플에 연결되어 있어요. 화면을 새로고침해 주세요.'
    }

    if (message.includes('already full')) {
        return '이미 두 명이 연결된 커플 코드예요.'
    }

    if (message.includes('Inactive couple invite code')) {
        return '비활성화된 커플 코드예요.'
    }

    if (message.includes('Invalid couple invite code')) {
        return '유효하지 않은 커플 코드예요.'
    }

    if (message.includes('violates foreign key constraint')) {
        return '프로필 저장이 아직 완료되지 않았어요. 프로필을 먼저 저장해 주세요.'
    }

    if (message.includes('gen_random_bytes')) {
        return '커플 코드 생성 함수 설정이 필요해요. pgcrypto 마이그레이션을 적용해 주세요.'
    }

    if (message.includes('permission denied')) {
        return '커플 생성 권한이 아직 적용되지 않았어요. Supabase RPC 권한 마이그레이션을 적용해 주세요.'
    }

    if (code === '42883' || message.includes('function') || message.includes('schema cache')) {
        return '커플 생성 DB 함수가 아직 적용되지 않았어요. Supabase 마이그레이션을 적용해 주세요.'
    }

    if (code === '42P01' || message.includes('does not exist')) {
        return '커플 테이블이 아직 적용되지 않았어요. Supabase 마이그레이션을 적용해 주세요.'
    }

    return `커플 연결을 완료하지 못했어요. (${code ?? 'unknown'})`
}

const mapCoupleDisconnectErrorMessage = (message?: string, code?: string) => {
    if (!message) {
        return '커플 연결 해제 상태를 변경하지 못했어요. 다시 시도해 주세요.'
    }

    if (message.includes('Authentication required')) {
        return '로그인 세션이 만료됐어요. 다시 로그인해 주세요.'
    }

    if (message.includes('Active couple required')) {
        return '활성 커플만 연결 해제를 요청할 수 있어요.'
    }

    if (
        message.includes('Disconnect pending couple required') ||
        message.includes('Unexpired disconnect pending couple required')
    ) {
        return '취소할 수 있는 연결 해제 대기 상태가 아니에요.'
    }

    if (message.includes('permission denied')) {
        return '커플 연결 해제 권한이 아직 적용되지 않았어요. Supabase RPC 권한 마이그레이션을 적용해 주세요.'
    }

    if (
        code === '42883' ||
        message.includes('function') ||
        message.includes('schema cache')
    ) {
        return '커플 연결 해제 DB 함수가 아직 적용되지 않았어요. Supabase 마이그레이션을 적용해 주세요.'
    }

    return `커플 연결 해제 상태를 변경하지 못했어요. (${code ?? 'unknown'})`
}

const getAuthenticatedSupabase = async () => {
    const supabase = await createServerSupabaseClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return supabase
}

const getCoupleSummary = async (coupleId: string) => {
    const supabase = await createServerSupabaseClient()
    const { data: couple, error } = await supabase
        .from('couples')
        .select('id, name, invite_code, friend_code')
        .eq('id', coupleId)
        .maybeSingle()

    if (error || !couple) {
        if (error) {
            console.error('Failed to load created couple', {
                code: error.code,
                message: error.message,
            })
        }

        return null
    }

    return {
        friendCode: couple.friend_code,
        id: couple.id,
        inviteCode: couple.invite_code,
        name: couple.name,
    } satisfies CoupleSummary
}

export const createCouple = async (
    previousState: CoupleActionState
): Promise<CoupleActionState> => {
    const supabase = await getAuthenticatedSupabase()
    const { data: coupleId, error } = await supabase.rpc('create_couple', {
        p_name: DEFAULT_COUPLE_NAME,
    })

    if (error || !coupleId) {
        if (error) {
            console.error('Failed to create couple', {
                code: error.code,
                message: error.message,
            })
        }

        return {
            ...previousState,
            errorMessage: mapCoupleErrorMessage(error?.message, error?.code),
        }
    }

    const couple = await getCoupleSummary(coupleId)

    if (!couple) {
        return {
            ...previousState,
            errorMessage: '커플 코드를 불러오지 못했어요.',
        }
    }

    revalidatePath('/app')
    revalidatePath('/couple/connect')

    return {
        couple,
        errorMessage: '',
    }
}

export const joinCouple = async (
    previousState: CoupleActionState,
    formData: FormData
): Promise<CoupleActionState> => {
    const supabase = await getAuthenticatedSupabase()
    const inviteCode = normalizeText(formData.get('inviteCode')).toUpperCase()

    if (!inviteCode) {
        return {
            ...previousState,
            errorMessage: '커플 코드를 입력해 주세요.',
        }
    }

    const { error } = await supabase.rpc('join_couple_by_invite_code', {
        p_invite_code: inviteCode,
    })

    if (error) {
        console.error('Failed to join couple', {
            code: error.code,
            message: error.message,
        })

        return {
            ...previousState,
            errorMessage: mapCoupleErrorMessage(error.message, error.code),
        }
    }

    revalidatePath('/app')
    revalidatePath('/couple/connect')
    redirect('/app')
}

export const requestCoupleDisconnect = async () => {
    const supabase = await getAuthenticatedSupabase()
    const { error } = await supabase.rpc('request_couple_disconnect')

    if (error) {
        console.error('Failed to request couple disconnect', {
            code: error.code,
            message: error.message,
        })

        redirect(
            `/app?disconnectError=${encodeURIComponent(
                mapCoupleDisconnectErrorMessage(error.message, error.code)
            )}`
        )
    }

    revalidatePath('/app')
    revalidatePath('/couple/connect')
    redirect('/app')
}

export const cancelCoupleDisconnect = async () => {
    const supabase = await getAuthenticatedSupabase()
    const { error } = await supabase.rpc('cancel_couple_disconnect')

    if (error) {
        console.error('Failed to cancel couple disconnect', {
            code: error.code,
            message: error.message,
        })

        redirect(
            `/app?disconnectError=${encodeURIComponent(
                mapCoupleDisconnectErrorMessage(error.message, error.code)
            )}`
        )
    }

    revalidatePath('/app')
    revalidatePath('/couple/connect')
    redirect('/app')
}
