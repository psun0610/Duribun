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
const placeActionsSource = readFileSync(
    path.resolve(process.cwd(), 'src/features/place/actions.ts'),
    'utf8'
)
const reviewDetailPanelSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/components/ReviewDetailPanel/ReviewDetailPanel.tsx'
    ),
    'utf8'
)
const reviewDetailCopySource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/components/ReviewDetailPanel/const/reviewDetailPanel.const.ts'
    ),
    'utf8'
)
const shareActionsSource = readFileSync(
    path.resolve(process.cwd(), 'src/features/share/actions.ts'),
    'utf8'
)
const shareTypesSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/share/types/shareSummary.types.ts'
    ),
    'utf8'
)

describe('share eligibility', () => {
    it('allows active couple members to toggle couple place sharing', () => {
        expect(placeActionsSource).toContain('updateCouplePlaceSharing')
        expect(placeActionsSource).toContain(".update({ is_public: isPublic })")
        expect(placeActionsSource).toContain("couple.status !== 'active'")
        expect(reviewDetailPanelSource).toContain('updateCouplePlaceSharing')
        expect(reviewDetailCopySource).toContain("shareTitle: '공유 설정'")
    })

    it('keeps public visibility gated by completed reviews and public photos', () => {
        expect(initialSchemaSql).toContain('public.is_couple_place_public_ready')
        expect(initialSchemaSql).toContain('public.couple_place_review_count(cp.id) = 2')
        expect(initialSchemaSql).toContain('public.couple_place_has_public_photo(cp.id)')
        expect(initialSchemaSql).toContain("rp.kind = 'place_food'")
        expect(initialSchemaSql).toContain("and cp.is_public")
        expect(initialSchemaSql).toContain("and c.status = 'active'")
    })

    it('exposes only public summary fields and place-food photo paths', () => {
        expect(publicSummaryMigrationSql).toContain('public_photo_paths')
        expect(publicSummaryMigrationSql).toContain("filter (where rp.kind = 'place_food')")
        expect(shareActionsSource).toContain('getFriendCouplePlaceSummaries')
        expect(shareActionsSource).toContain('getExploreCouplePlaceSummaries')
        expect(shareTypesSource).toContain('averageRating')
        expect(shareTypesSource).toContain('placeName')
        expect(shareTypesSource).toContain('tags')
        expect(shareTypesSource).toContain('photos')
        expect(shareTypesSource).not.toContain('oneLineReview')
        expect(shareTypesSource).not.toContain('authorId')
        expect(shareTypesSource).not.toContain('couple_private')
    })

    it('keeps storage access aligned with the same visibility rules', () => {
        expect(initialSchemaSql).toContain(
            'create policy "review photo objects select visible"'
        )
        expect(initialSchemaSql).toContain("rp.kind = 'place_food'")
        expect(initialSchemaSql).toContain('public.is_couple_place_public_ready(cp.id)')
        expect(initialSchemaSql).toContain('public.is_couple_place_explore_ready(cp.id)')
        expect(initialSchemaSql).toContain('public.are_friend_couples')
    })
})
