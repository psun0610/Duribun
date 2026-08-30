import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { getEnv } from '@/lib/env'

/**
 * service_role 키를 쓰는 관리자용 클라이언트입니다.
 * RLS를 우회하므로 사용자 요청 경로에서는 절대 쓰지 않습니다.
 * 만료된 커플 정리처럼 service_role에만 grant된 RPC 전용입니다.
 */
export const createAdminSupabaseClient = () => {
    return createClient<Database>(
        getEnv('NEXT_PUBLIC_SUPABASE_URL'),
        getEnv('SUPABASE_SERVICE_ROLE_KEY'),
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
}
