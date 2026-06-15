import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

const appPageSource = readFileSync(
    path.resolve(process.cwd(), 'src/app/app/page.tsx'),
    'utf8'
)
const couplePlaceAppSource = readFileSync(
    path.resolve(process.cwd(), 'src/components/CouplePlaceApp/CouplePlaceApp.tsx'),
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

describe('review detail', () => {
    it('loads review detail data for protected couple places', () => {
        expect(appPageSource).toContain('getCouplePlaceReviewDetailsMap')
        expect(appPageSource).toContain('reviewDetailsByPlaceId')
        expect(appPageSource).toContain('currentUserId={user.id}')
    })

    it('opens a private detail panel with review state copy', () => {
        expect(couplePlaceAppSource).toContain('ReviewDetailPanel')
        expect(couplePlaceAppSource).toContain('onOpenReviewDetail')
        expect(couplePlaceAppSource).toContain('상세 보기')
        expect(reviewDetailCopySource).toContain(
            "'partner-waiting': '상대가 기다리고 있어요.'"
        )
        expect(reviewDetailCopySource).toContain("none: '이 장소는 어땠나요?'")
        expect(reviewDetailCopySource).toContain(
            "'waiting-partner': '상대를 기다리는 중...'"
        )
    })

    it('shows private one-line reviews, ratings, tags, and photos only inside the couple space', () => {
        expect(reviewDetailPanelSource).toContain('oneLineReview')
        expect(reviewDetailPanelSource).toContain('rating')
        expect(reviewDetailPanelSource).toContain('photoGrid')
        expect(reviewDetailPanelSource).toContain('REVIEW_PHOTO_KIND_LABEL')
        expect(reviewDetailCopySource).toContain("myReview: '내 리뷰'")
        expect(reviewDetailCopySource).toContain("partnerReview: '파트너 리뷰'")
    })

    it('keeps completed review state aligned with average rating and photo visibility rules', () => {
        expect(reviewDetailPanelSource).toContain('averageRating')
        expect(reviewDetailCopySource).toContain("complete: '커플 리뷰 완료'")
        expect(reviewDetailCopySource).toContain("privateBadge: '비공개 상세'")
        expect(reviewDetailCopySource).toContain("publicBadge: '공개'")
    })
})
