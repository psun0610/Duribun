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

    if (code) {
        const supabase = await createRouteHandlerSupabaseClient()
        await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin))
}
