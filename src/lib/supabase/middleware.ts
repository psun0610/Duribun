import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { getAuthGateRedirect } from '@/features/auth/routing';
import { getEnv } from '@/lib/env';

export const updateSession = async (request: NextRequest) => {
    let response = NextResponse.next({
        request,
    });

    const supabase = createServerClient<Database>(
        getEnv('NEXT_PUBLIC_SUPABASE_URL'),
        getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        {
            cookies: {
                getAll: () => {
                    return request.cookies.getAll();
                },
                setAll: cookiesToSet => {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const redirectPath = getAuthGateRedirect({
        pathname: request.nextUrl.pathname,
        isAuthenticated: Boolean(user),
    });

    if (redirectPath) {
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return response;
};
