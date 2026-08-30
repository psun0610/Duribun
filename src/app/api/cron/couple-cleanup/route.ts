import { NextResponse, type NextRequest } from 'next/server'

import { getEnv } from '@/lib/env'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * 유예 기간이 만료된 연결 해제 대기 커플을 삭제합니다.
 * docs/product-decisions.md의 "7일 후 커플 데이터 삭제"를 실제로 수행하는 유일한 경로입니다.
 *
 * Vercel Cron이 `Authorization: Bearer $CRON_SECRET` 헤더로 호출합니다.
 * CRON_SECRET이 설정되지 않았다면 열린 엔드포인트가 되지 않도록 거부합니다.
 */
export const GET = async (request: NextRequest) => {
    let cronSecret: string

    try {
        cronSecret = getEnv('CRON_SECRET')
    } catch {
        console.error('CRON_SECRET is not configured; cleanup endpoint disabled')

        return NextResponse.json(
            { error: 'Cleanup endpoint is not configured' },
            { status: 503 }
        )
    }

    if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminSupabaseClient()
    const { error } = await supabase.rpc('delete_expired_disconnected_couples')

    if (error) {
        console.error('Failed to delete expired disconnected couples', {
            code: error.code,
            message: error.message,
        })

        return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}
