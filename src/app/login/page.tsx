import { redirect } from 'next/navigation';

import { LoginPanel } from '@/components/LoginPanel';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const LoginPage = async () => {
    const supabase = await createServerSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect('/app');
    }

    return <LoginPanel />;
};

export default LoginPage;
