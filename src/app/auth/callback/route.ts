import { NextResponse, type NextRequest } from 'next/server'
import { normalizeInternalRedirectPath } from '@/features/auth/routing'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server'

const buildLoginRedirect = (requestUrl: URL, next: string) => {
    return NextResponse.redirect(
        new URL(
            `/login?authError=1&next=${encodeURIComponent(next)}`,
            requestUrl.origin
        )
    )
}

export const GET = async (request: NextRequest) => {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = normalizeInternalRedirectPath(
        requestUrl.searchParams.get('next'),
        '/app'
    )

    // 제공자나 Supabase가 실패를 알려온 경우입니다. 그냥 넘기면 로그인 화면을
    // 오가기만 해서 사용자는 이유를 알 수 없습니다.
    const providerError =
        requestUrl.searchParams.get('error') ??
        requestUrl.searchParams.get('error_code')

    if (providerError) {
        console.error('Auth provider returned an error', {
            error: providerError,
            description: requestUrl.searchParams.get('error_description'),
        })

        return buildLoginRedirect(requestUrl, next)
    }

    if (!code) {
        console.error('Auth callback reached without an authorization code')

        return buildLoginRedirect(requestUrl, next)
    }

    const supabase = await createRouteHandlerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
        console.error('Failed to exchange auth code for session', {
            message: error.message,
        })

        return buildLoginRedirect(requestUrl, next)
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin))
}
