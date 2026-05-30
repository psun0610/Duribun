import { redirect } from 'next/navigation';

import { ProtectedSpace } from '@/components/ProtectedSpace';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const ProtectedAppPage = async () => {
    const supabase = await createServerSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return <ProtectedSpace userLabel={user.email ?? user.id} />;
};

export default ProtectedAppPage;
