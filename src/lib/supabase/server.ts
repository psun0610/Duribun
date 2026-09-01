import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { getEnv } from '@/lib/env'
import { isStaleRefreshTokenError } from '@/lib/supabase/authError'

export const createServerSupabaseClient = async () => {
    const cookieStore = await cookies()

    return createServerClient<Database>(
        getEnv('NEXT_PUBLIC_SUPABASE_URL'),
        getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        {
            cookies: {
                getAll: () => {
                    return cookieStore.getAll()
                },
                setAll: cookiesToSet => {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Server Components cannot set cookies. Middleware refreshes sessions.
                    }
                },
            },
        }
    )
}

export const createRouteHandlerSupabaseClient = async () => {
    return createServerSupabaseClient()
}

/**
 * 화면을 그릴 때 쓰는 신원 확인입니다.
 *
 * getUser()는 매번 Supabase Auth로 네트워크 왕복을 합니다. 실측으로 한 번에
 * 150~185ms가 들고, 화면마다 이게 붙어 있었습니다. 이 프로젝트는 ES256
 * 비대칭 서명키를 쓰므로 getClaims()가 JWKS로 로컬에서 검증합니다.
 *
 * 세션 갱신은 미들웨어의 getUser()가 계속 담당합니다. 여기서는 이미 갱신된
 * 토큰을 읽기만 합니다.
 */
export const getServerUserId = async (
    supabase: SupabaseClient<Database>
): Promise<string | null> => {
    try {
        const { data, error } = await supabase.auth.getClaims()

        if (error || !data?.claims?.sub) {
            return null
        }

        return data.claims.sub
    } catch (error) {
        if (isStaleRefreshTokenError(error)) {
            return null
        }

        throw error
    }
}

export const getServerUser = async (
    supabase: SupabaseClient<Database>
): Promise<User | null> => {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        return user
    } catch (error) {
        if (isStaleRefreshTokenError(error)) {
            return null
        }

        throw error
    }
}
