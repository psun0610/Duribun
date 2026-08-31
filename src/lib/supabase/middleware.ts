import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { getAuthGateRedirect, isProtectedPath } from '@/features/auth/routing'
import { isStaleRefreshTokenError } from '@/lib/supabase/authError'
import { getEnv } from '@/lib/env'

const isSupabaseAuthCookie = (cookieName: string) => {
    return cookieName.startsWith('sb-') && cookieName.includes('auth-token')
}

const clearSupabaseAuthCookies = (
    request: NextRequest,
    response: NextResponse
) => {
    request.cookies
        .getAll()
        .filter(cookie => isSupabaseAuthCookie(cookie.name))
        .forEach(cookie => {
            request.cookies.delete(cookie.name)
            response.cookies.set(cookie.name, '', {
                maxAge: 0,
                path: '/',
            })
        })
}

export const updateSession = async (request: NextRequest) => {
    let response = NextResponse.next({
        request,
    })
    const pathname = request.nextUrl.pathname
    const shouldCheckAuth = isProtectedPath(pathname) || pathname === '/login'

    if (!shouldCheckAuth) {
        return response
    }

    const supabase = createServerClient<Database>(
        getEnv('NEXT_PUBLIC_SUPABASE_URL'),
        getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        {
            cookies: {
                getAll: () => {
                    return request.cookies.getAll()
                },
                setAll: cookiesToSet => {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    let isAuthenticated = false
    let hasStaleAuthTokens = false

    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser()

        isAuthenticated = Boolean(user)

        // getUser는 대부분 던지지 않고 error를 반환합니다. 반환된 쪽도 검사합니다.
        if (!user && error && isStaleRefreshTokenError(error)) {
            hasStaleAuthTokens = true
        }
    } catch (error) {
        // 미들웨어는 어떤 경우에도 화면을 막지 않습니다. 조회가 실패하면
        // 로그인하지 않은 상태로 보고 넘어갑니다. 여기서 throw하면
        // 네트워크가 잠깐 흔들릴 때마다 /login과 /app이 통째로 열리지 않습니다.
        if (isStaleRefreshTokenError(error)) {
            hasStaleAuthTokens = true
        } else {
            console.error('Failed to resolve the session in middleware', {
                message: error instanceof Error ? error.message : String(error),
                pathname,
            })
        }
    }

    if (hasStaleAuthTokens) {
        response = NextResponse.next({
            request,
        })
        clearSupabaseAuthCookies(request, response)
    }

    const redirectPath = getAuthGateRedirect({
        pathname,
        isAuthenticated,
        next: request.nextUrl.searchParams.get('next'),
    })

    if (redirectPath) {
        const redirectResponse = NextResponse.redirect(
            new URL(redirectPath, request.url)
        )

        // 만료된 토큰일 때만 지웁니다. 무조건 지우면 로그인된 사용자가
        // /login에 들어왔다가 나가는 순간 세션이 날아갑니다.
        if (hasStaleAuthTokens) {
            clearSupabaseAuthCookies(request, redirectResponse)
        }

        return redirectResponse
    }

    return response
}
