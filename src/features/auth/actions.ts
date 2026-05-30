'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Provider } from '@supabase/supabase-js';
import { getSiteUrl } from '@/lib/env';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const providerMap = {
    kakao: 'kakao',
    google: 'google',
    naver: process.env.SUPABASE_AUTH_NAVER_PROVIDER_ID ?? 'custom:naver',
} as const;

type SupportedProvider = keyof typeof providerMap;

const parseProvider = (
    value: FormDataEntryValue | null
): SupportedProvider => {
    if (value === 'kakao' || value === 'naver' || value === 'google') {
        return value;
    }

    throw new Error('Unsupported auth provider');
};

export const signInWithProvider = async (formData: FormData) => {
    const selectedProvider = parseProvider(formData.get('provider'));
    const provider = providerMap[selectedProvider] as Provider;
    const headerStore = await headers();
    const origin = headerStore.get('origin') ?? getSiteUrl();
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        throw error;
    }

    if (data.url) {
        redirect(data.url);
    }

    redirect('/login');
};

export const signOut = async () => {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    redirect('/login');
};
