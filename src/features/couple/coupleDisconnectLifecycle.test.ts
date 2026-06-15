import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

const initialSchemaSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260525000000_initial_schema.sql'
    ),
    'utf8'
)
const disconnectLifecycleSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260612000000_enforce_couple_disconnect_lifecycle.sql'
    ),
    'utf8'
)
const appPageSource = readFileSync(
    path.resolve(process.cwd(), 'src/app/app/page.tsx'),
    'utf8'
)

describe('couple disconnect lifecycle', () => {
    it('lets an active couple member request a seven-day disconnect window', () => {
        expect(initialSchemaSql).toContain(
            'create or replace function public.request_couple_disconnect()'
        )
        expect(initialSchemaSql).toContain(
            "set status = 'disconnect_pending'"
        )
        expect(initialSchemaSql).toContain(
            "delete_after = now() + interval '7 days'"
        )
        expect(initialSchemaSql).toContain(
            'grant execute on function public.request_couple_disconnect() to authenticated;'
        )
    })

    it('allows cancellation only before the disconnect window expires', () => {
        expect(disconnectLifecycleSql).toContain(
            'create or replace function public.cancel_couple_disconnect()'
        )
        expect(disconnectLifecycleSql).toContain('and c.delete_after > now()')
        expect(disconnectLifecycleSql).toContain(
            "raise exception 'Unexpired disconnect pending couple required'"
        )
        expect(disconnectLifecycleSql).toContain(
            "set status = 'active'"
        )
    })

    it('stops direct couple row updates so lifecycle transitions use RPCs', () => {
        expect(disconnectLifecycleSql).toContain(
            'drop policy if exists "couples update active member" on public.couples;'
        )
        expect(disconnectLifecycleSql).toContain(
            'revoke update on public.couples from authenticated;'
        )
    })

    it('removes expired disconnect-pending couples through the service-role cleanup path', () => {
        expect(initialSchemaSql).toContain(
            'create or replace function public.delete_expired_disconnected_couples()'
        )
        expect(initialSchemaSql).toContain(
            "where status = 'disconnect_pending'"
        )
        expect(initialSchemaSql).toContain('and delete_after <= now()')
        expect(initialSchemaSql).toContain(
            'grant execute on function public.delete_expired_disconnected_couples() to service_role;'
        )
    })

    it('keeps pending couples out of ordinary couple-space rendering', () => {
        expect(appPageSource).toContain(
            "if (couple.status === 'disconnect_pending')"
        )
        expect(appPageSource).toContain('<CoupleDisconnectPending')
        expect(appPageSource).toContain('<ProtectedSpace')
    })
})
