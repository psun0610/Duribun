export const protectedRoutes = ['/app'];

type AuthGateInput = {
    pathname: string;
    isAuthenticated: boolean;
};

export const isProtectedPath = (pathname: string) => {
    return protectedRoutes.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    );
};

export const getAuthGateRedirect = ({
    pathname,
    isAuthenticated,
}: AuthGateInput) => {
    if (!isAuthenticated && isProtectedPath(pathname)) {
        return `/login?next=${encodeURIComponent(pathname)}`;
    }

    if (isAuthenticated && pathname === '/login') {
        return '/app';
    }

    return null;
};
