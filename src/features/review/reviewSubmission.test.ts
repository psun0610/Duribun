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
const reviewActionsSource = readFileSync(
    path.resolve(process.cwd(), 'src/features/review/actions.ts'),
    'utf8'
)
const reviewPanelSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/review/components/ReviewWriterPanel/ReviewWriterPanel.tsx'
    ),
    'utf8'
)
const reviewPanelCopySource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/review/const/reviewSubmission.const.ts'
    ),
    'utf8'
)
const reviewUtilsSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/review/utils/reviewSubmission.utils.ts'
    ),
    'utf8'
)

describe('review submission', () => {
    it('requires the private review photos bucket and storage policy', () => {
        expect(initialSchemaSql).toContain(
            "values ('review-photos', 'review-photos', false)"
        )
        expect(initialSchemaSql).toContain(
            'create policy "review photo objects select visible"'
        )
        expect(initialSchemaSql).toContain("bucket_id = 'review-photos'")
    })

    it('keeps one review per couple place and author', () => {
        expect(initialSchemaSql).toContain(
            'unique (couple_place_id, author_id)'
        )
        expect(initialSchemaSql).toContain(
            'constraint rating_range check (rating >= 0.5 and rating <= 5)'
        )
    })

    it('stores extensible rating metrics separately from representative review rating', () => {
        expect(initialSchemaSql).toContain('create table public.review_ratings')
        expect(initialSchemaSql).toContain('rating_key text not null')
        expect(initialSchemaSql).toContain('rating_label text not null')
        expect(initialSchemaSql).toContain('score numeric(2, 1) not null')
        expect(initialSchemaSql).toContain(
            'primary key (review_id, rating_key)'
        )
        expect(initialSchemaSql).toContain(
            'constraint review_rating_score_range check'
        )
        expect(initialSchemaSql).toContain('score * 2 = round(score * 2)')
        expect(reviewPanelCopySource).toContain('REVIEW_RATING_OPTIONS')
        expect(reviewPanelSource).toContain('ratingKey')
        expect(reviewPanelSource).toContain('ratingLabel')
        expect(reviewPanelSource).toContain('ratingScore')
        expect(reviewActionsSource).toContain('parseReviewRatings')
        expect(reviewActionsSource).toContain('getRepresentativeRating')
        expect(reviewActionsSource).toContain('review_ratings')
    })

    it('uploads multiple photos with explicit photo kinds', () => {
        expect(reviewPanelSource).toContain('selectedPhotos')
        expect(reviewPanelSource).toContain('ReviewPhotoGrid')
        expect(reviewPanelSource).toContain('photoFile')
        expect(reviewPanelSource).toContain('photoKind')
        expect(reviewPanelCopySource).toContain("addPhoto: '사진 추가'")
        expect(reviewActionsSource).toContain('buildReviewPhotoInputs')
        expect(reviewActionsSource).toContain('review-photos')
        expect(reviewActionsSource).toContain('storage_path')
    })

    it('requires rating metrics, tags, one-line text, and at least one photo', () => {
        expect(reviewActionsSource).toContain(
            '카테고리에 맞는 모든 평점을 0.5점에서 5점 사이로 선택해 주세요.'
        )
        expect(reviewActionsSource).toContain('태그를 하나 이상 선택해 주세요.')
        expect(reviewActionsSource).toContain(
            '사진은 최소 1장 필요하고 각 사진의 유형을 선택해야 해요.'
        )
        expect(reviewPanelSource).toContain('reviewState.errorMessage')
        expect(reviewPanelSource).toContain('reviewState.successMessage')
    })

    it('connects uploaded photos to review rows through storage paths', () => {
        expect(reviewActionsSource).toContain('getReviewPhotoPath')
        expect(reviewActionsSource).toContain('review_photos')
        expect(reviewActionsSource).toContain('review_tags')
        expect(reviewUtilsSource).toContain('buildReviewPhotoInputs')
        expect(reviewUtilsSource).toContain('normalizeReviewText')
    })
})
