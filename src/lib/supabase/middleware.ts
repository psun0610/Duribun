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

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        isAuthenticated = Boolean(user)
    } catch (error) {
        if (!isStaleRefreshTokenError(error)) {
            throw error
        }

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

        clearSupabaseAuthCookies(request, redirectResponse)

        return redirectResponse
    }

    return response
}
