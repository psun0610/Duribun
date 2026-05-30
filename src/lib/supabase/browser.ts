'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { getEnv } from '@/lib/env';

export const createBrowserSupabaseClient = () => {
    return createBrowserClient<Database>(
        getEnv('NEXT_PUBLIC_SUPABASE_URL'),
        getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    );
};
