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
const friendFilterSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260615002000_add_friend_filter_summaries.sql'
    ),
    'utf8'
)
const friendActionsSource = readFileSync(
    path.resolve(process.cwd(), 'src/features/friend/actions.ts'),
    'utf8'
)
const friendPanelSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/place/components/CouplePlaceApp/components/FriendRecommendationsPanel.tsx'
    ),
    'utf8'
)
const appDataSource = readFileSync(
    path.resolve(process.cwd(), 'src/app/app/getProtectedAppData.ts'),
    'utf8'
)
const friendsPageSource = readFileSync(
    path.resolve(process.cwd(), 'src/app/app/friends/page.tsx'),
    'utf8'
)

describe('friend relationships and filters', () => {
    it('lets couples view, copy, and regenerate a friend code without deleting friendships', () => {
        expect(initialSchemaSql).toContain('friend_code text not null unique')
        expect(initialSchemaSql).toContain(
            'create or replace function public.regenerate_friend_code()'
        )
        expect(initialSchemaSql).toContain('friend_code_rotated_at = now()')
        expect(initialSchemaSql).not.toContain('delete from public.couple_friendships')
        expect(friendPanelSource).toContain('navigator.clipboard.writeText')
        expect(friendPanelSource).toContain('regenerateFriendCode')
    })

    it('creates couple-to-couple friendships by valid friend code and rejects invalid/self codes', () => {
        expect(initialSchemaSql).toContain(
            'create table public.couple_friendships'
        )
        expect(initialSchemaSql).toContain(
            'create or replace function public.create_friendship_by_friend_code'
        )
        expect(initialSchemaSql).toContain("raise exception 'Invalid friend code'")
        expect(initialSchemaSql).toContain(
            "raise exception 'Cannot add own couple as friend'"
        )
        expect(friendActionsSource).toContain('addFriendCoupleByCode')
        expect(friendActionsSource).toContain(
            '우리 코드예요. 친구에게 받은 코드를 넣어주세요.'
        )
    })

    it('shows friend couple names and only public-ready friend recommendations', () => {
        expect(initialSchemaSql).toContain('public.friend_couple_place_summaries')
        expect(initialSchemaSql).toContain('public.is_couple_place_public_ready(cp.id)')
        expect(initialSchemaSql).toContain('c.name as couple_name')
        expect(appDataSource).toContain('getFriendCouplePlaceSummaries')
        expect(friendsPageSource).toContain('FriendRecommendationsPanel')
        expect(friendsPageSource).toContain(
            'recommendations={appState.data.friendRecommendations}'
        )
        expect(friendPanelSource).toContain('recommendation.coupleName')
    })

    it('stores friend couple filter toggles per user and applies them to recommendations', () => {
        expect(initialSchemaSql).toContain(
            'create table public.friend_couple_filters'
        )
        expect(initialSchemaSql).toContain('primary key (user_id, friend_couple_id)')
        expect(friendFilterSql).toContain('public.friend_couple_filter_summaries')
        expect(friendFilterSql).toContain('fcf.user_id = auth.uid()')
        expect(friendFilterSql).toContain('and coalesce(fcf.enabled, true)')
        expect(friendActionsSource).toContain('updateFriendCoupleFilter')
        expect(friendActionsSource).toContain("onConflict: 'user_id,friend_couple_id'")
    })
})
