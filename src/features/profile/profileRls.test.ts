import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

const migrationSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260525000000_initial_schema.sql'
    ),
    'utf8'
)
const profileAvatarStorageSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260609143000_add_profile_avatar_storage.sql'
    ),
    'utf8'
)

describe('profiles RLS policies', () => {
    it('enables row level security on profiles', () => {
        expect(migrationSql).toContain(
            'alter table public.profiles enable row level security;'
        )
    })

    it('allows users to select only their own profile', () => {
        expect(migrationSql).toContain('create policy "profiles select self"')
        expect(migrationSql).toContain('on public.profiles for select')
        expect(migrationSql).toContain('using (id = auth.uid());')
    })

    it('allows users to insert and update only their own profile', () => {
        expect(migrationSql).toContain('create policy "profiles insert self"')
        expect(migrationSql).toContain('on public.profiles for insert')
        expect(migrationSql).toContain('with check (id = auth.uid());')
        expect(migrationSql).toContain('create policy "profiles update self"')
        expect(migrationSql).toContain('on public.profiles for update')
        expect(migrationSql).toContain('using (id = auth.uid())')
    })

    it('stores profile avatars in a public bucket with own-folder writes', () => {
        expect(profileAvatarStorageSql).toContain(
            "values ('profile-avatars', 'profile-avatars', true)"
        )
        expect(profileAvatarStorageSql).toContain(
            'create policy "profile avatar objects select public"'
        )
        expect(profileAvatarStorageSql).toContain(
            '(storage.foldername(name))[1] = auth.uid()::text'
        )
    })
})
