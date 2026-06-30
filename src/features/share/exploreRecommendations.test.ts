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
const publicSummaryMigrationSql = readFileSync(
    path.resolve(
        process.cwd(),
        'supabase/migrations/20260615001000_add_public_share_summaries.sql'
    ),
    'utf8'
)
const shareActionsSource = readFileSync(
    path.resolve(process.cwd(), 'src/features/share/actions.ts'),
    'utf8'
)
const explorePanelSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/place/components/CouplePlaceApp/components/ExploreRecommendationsPanel.tsx'
    ),
    'utf8'
)
const appPageSource = readFileSync(
    path.resolve(process.cwd(), 'src/app/app/page.tsx'),
    'utf8'
)

describe('explore recommendations', () => {
    it('reads public-ready places from active couples only', () => {
        expect(initialSchemaSql).toContain('public.explore_couple_place_summaries')
        expect(initialSchemaSql).toContain('public.is_couple_place_explore_ready(cp.id)')
        expect(initialSchemaSql).toContain("and c.status = 'active'")
        expect(appPageSource).toContain('getExploreCouplePlaceSummaries')
    })

    it('excludes private, incomplete, photo-less, and disconnect-pending places', () => {
        expect(initialSchemaSql).toContain('public.is_couple_place_public_ready')
        expect(initialSchemaSql).toContain('and cp.is_public')
        expect(initialSchemaSql).toContain('public.couple_place_review_count(cp.id) = 2')
        expect(initialSchemaSql).toContain('public.couple_place_has_public_photo(cp.id)')
        expect(initialSchemaSql).toContain("and c.status = 'active'")
    })

    it('keeps manual places out of explore until approved or matched', () => {
        expect(initialSchemaSql).toContain('public.is_couple_place_explore_ready')
        expect(initialSchemaSql).toContain(
            "and (p.provider = 'kakao' or p.is_explore_approved)"
        )
    })

    it('supports recommended, rating, and latest sorting', () => {
        expect(shareActionsSource).toContain("filters.sort === 'rating'")
        expect(shareActionsSource).toContain("filters.sort === 'latest'")
        expect(shareActionsSource).toContain(".order('review_count'")
        expect(shareActionsSource).toContain(".order('average_rating'")
        expect(shareActionsSource).toContain(".order('updated_at'")
        expect(explorePanelSource).toContain("useState<PublicSummarySort>('recommended')")
    })

    it('supports category and region filters in the read action and UI', () => {
        expect(shareActionsSource).toContain("filters.category !== 'all'")
        expect(shareActionsSource).toContain(".eq('category', filters.category)")
        expect(shareActionsSource).toContain('address.ilike')
        expect(shareActionsSource).toContain('road_address.ilike')
        expect(explorePanelSource).toContain('EXPLORE_CATEGORY_OPTIONS')
        expect(explorePanelSource).toContain('EXPLORE_REGION_OPTIONS')
    })

    it('exposes only public summary fields needed by explore cards', () => {
        expect(publicSummaryMigrationSql).toContain('public_photo_paths')
        expect(shareActionsSource).toContain('PUBLIC_SUMMARY_SELECT')
        expect(shareActionsSource).not.toContain('one_line_review')
        expect(shareActionsSource).not.toContain('author_id')
    })
})
