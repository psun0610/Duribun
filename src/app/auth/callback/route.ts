import { NextResponse, type NextRequest } from 'next/server'
import { normalizeInternalRedirectPath } from '@/features/auth/routing'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server'

export const GET = async (request: NextRequest) => {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = normalizeInternalRedirectPath(
        requestUrl.searchParams.get('next'),
        '/app'
    )

    if (!code) {
        return NextResponse.redirect(
            new URL(
                `/login?authError=1&next=${encodeURIComponent(next)}`,
                requestUrl.origin
            )
        )
    }

    const supabase = await createRouteHandlerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
        console.error('Failed to exchange auth code for session', {
            message: error.message,
        })

        return NextResponse.redirect(
            new URL(
                `/login?authError=1&next=${encodeURIComponent(next)}`,
                requestUrl.origin
            )
        )
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin))
}
