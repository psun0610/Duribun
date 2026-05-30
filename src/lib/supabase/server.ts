import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { getEnv } from '@/lib/env';

export const createServerSupabaseClient = async () => {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        getEnv('NEXT_PUBLIC_SUPABASE_URL'),
        getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        {
            cookies: {
                getAll: () => {
                    return cookieStore.getAll();
                },
                setAll: cookiesToSet => {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Server Components cannot set cookies. Middleware refreshes sessions.
                    }
                },
            },
        }
    );
};

export const createRouteHandlerSupabaseClient = async () => {
    return createServerSupabaseClient();
};
