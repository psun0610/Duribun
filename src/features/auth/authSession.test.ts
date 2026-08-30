import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

const middlewareSource = readFileSync(
    path.resolve(process.cwd(), 'src/lib/supabase/middleware.ts'),
    'utf8'
)
const callbackSource = readFileSync(
    path.resolve(process.cwd(), 'src/app/auth/callback/route.ts'),
    'utf8'
)
const loginPanelSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/auth/components/LoginPanel/LoginPanel.tsx'
    ),
    'utf8'
)

describe('auth session handling', () => {
    it('keeps valid sessions when redirecting away from login', () => {
        // 리다이렉트마다 무조건 쿠키를 지우면, 로그인된 사용자가 /login에
        // 들어온 순간 세션이 날아갑니다. 만료된 토큰일 때만 지워야 합니다.
        const redirectBlock = middlewareSource.slice(
            middlewareSource.indexOf('if (redirectPath)')
        )

        expect(redirectBlock).toContain('if (hasStaleAuthTokens)')
        expect(redirectBlock).not.toMatch(
            /NextResponse\.redirect[\s\S]{0,200}^\s{8}clearSupabaseAuthCookies/m
        )
    })

    it('detects stale tokens from returned errors, not only thrown ones', () => {
        expect(middlewareSource).toContain(
            'if (!user && error && isStaleRefreshTokenError(error))'
        )
    })

    it('sends failed code exchanges back to login with a visible message', () => {
        expect(callbackSource).toContain('exchangeCodeForSession(code)')
        expect(callbackSource).toContain('authError=1')
        expect(callbackSource).not.toContain(
            'await supabase.auth.exchangeCodeForSession(code)\n    }'
        )
        expect(loginPanelSource).toContain('hasAuthError')
        expect(loginPanelSource).toContain('LOGIN_PANEL_COPY.authErrorMessage')
    })
})
