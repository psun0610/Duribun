import { supabase, apiCall } from '@/lib/supabase/client'

export const signUp = async (
    email: string,
    password: string,
    name: string,
): Promise<void> => {
    await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
    })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
}

export const signIn = async (
    email: string,
    password: string,
): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
}
