export const protectedRoutes = ['/app', '/profile/setup']

type AuthGateInput = {
    pathname: string
    isAuthenticated: boolean
    next?: string | null
}

export const isProtectedPath = (pathname: string) => {
    return protectedRoutes.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    )
}

export const normalizeInternalRedirectPath = (
    value: string | null | undefined,
    fallback: string
) => {
    if (!value || !value.startsWith('/') || value.startsWith('//')) {
        return fallback
    }

    if (
        value === '/login' ||
        value.startsWith('/login?') ||
        value.startsWith('/login/')
    ) {
        return fallback
    }

    if (
        value === '/auth/callback' ||
        value.startsWith('/auth/callback?') ||
        value.startsWith('/auth/callback/')
    ) {
        return fallback
    }

    return value
}

export const getAuthGateRedirect = ({
    pathname,
    isAuthenticated,
    next,
}: AuthGateInput) => {
    if (!isAuthenticated && isProtectedPath(pathname)) {
        return `/login?next=${encodeURIComponent(pathname)}`
    }

    if (isAuthenticated && pathname === '/login') {
        return normalizeInternalRedirectPath(next, '/profile/setup')
    }

    return null
}
