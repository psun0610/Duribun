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
const refinedJoinSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260609150000_refine_couple_invite_join_errors.sql'
    ),
    'utf8'
)
const shortCodeSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260610001000_shorten_public_codes_to_six_chars.sql'
    ),
    'utf8'
)
const grantRpcSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260610002000_grant_couple_rpc_execute.sql'
    ),
    'utf8'
)
const randomBytesSchemaSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260610003000_fix_public_code_random_bytes_schema.sql'
    ),
    'utf8'
)

describe('couple onboarding RPCs', () => {
    it('creates a couple with separate invite and friend codes', () => {
        expect(initialSchemaSql).toContain('create or replace function public.create_couple')
        expect(initialSchemaSql).toContain('new_invite_code := public.generate_public_code()')
        expect(initialSchemaSql).toContain('new_friend_code := public.generate_public_code()')
        expect(initialSchemaSql).toContain(
            'insert into public.couple_members (couple_id, user_id)'
        )
    })

    it('generates six-character public codes', () => {
        expect(initialSchemaSql).toContain(
            "upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 6))"
        )
        expect(shortCodeSql).toContain(
            "upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 6))"
        )
        expect(randomBytesSchemaSql).toContain(
            "upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 6))"
        )
    })

    it('rejects join attempts for invalid, inactive, full, and already-connected users', () => {
        expect(refinedJoinSql).toContain('User is already in a couple')
        expect(refinedJoinSql).toContain('Invalid couple invite code')
        expect(refinedJoinSql).toContain('Inactive couple invite code')
        expect(refinedJoinSql).toContain('Couple is already full')
    })

    it('grants authenticated users access to onboarding RPCs', () => {
        expect(initialSchemaSql).toContain(
            'grant execute on function public.create_couple(text) to authenticated;'
        )
        expect(initialSchemaSql).toContain(
            'grant execute on function public.join_couple_by_invite_code(text) to authenticated;'
        )
        expect(grantRpcSql).toContain(
            'grant execute on function public.create_couple(text) to authenticated;'
        )
        expect(grantRpcSql).toContain(
            'grant execute on function public.join_couple_by_invite_code(text) to authenticated;'
        )
    })
})
