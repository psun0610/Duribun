import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

const appPageSource = readFileSync(
    path.resolve(process.cwd(), 'src/app/app/page.tsx'),
    'utf8'
)
const couplePlaceAppSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/place/components/CouplePlaceApp/CouplePlaceApp.tsx'
    ),
    'utf8'
)
const reviewDetailPanelSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/review/components/ReviewDetailPanel/ReviewDetailPanel.tsx'
    ),
    'utf8'
)
const registeredPlaceCardsSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/place/components/CouplePlaceApp/components/RegisteredPlaceCards.tsx'
    ),
    'utf8'
)
const reviewCardSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/review/components/ReviewDetailPanel/components/ReviewCard.tsx'
    ),
    'utf8'
)
const reviewDetailCopySource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/review/components/ReviewDetailPanel/const/reviewDetailPanel.const.ts'
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
        expect(registeredPlaceCardsSource).toContain(
            'getReviewDetailTargetPlace'
        )
        expect(reviewDetailCopySource).toContain(
            "'partner-waiting': '상대가 리뷰를 기다리고 있어요'"
        )
        expect(reviewDetailCopySource).toContain(
            "none: '리뷰를 작성해 주세요!'"
        )
        expect(reviewDetailCopySource).toContain(
            "'waiting-partner': '아직 상대가 작성하지 않았어요'"
        )
    })

    it('shows private one-line reviews, ratings, tags, and photos only inside the couple space', () => {
        expect(reviewCardSource).toContain('oneLineReview')
        expect(reviewCardSource).toContain('rating')
        expect(reviewCardSource).toContain('photoGrid')
        expect(reviewCardSource).toContain('REVIEW_PHOTO_KIND_LABEL')
        expect(reviewDetailCopySource).toContain("myReview: '내 리뷰'")
        expect(reviewDetailCopySource).toContain("partnerReview: '상대 리뷰'")
    })

    it('keeps completed review state aligned with average rating and photo visibility rules', () => {
        expect(reviewDetailPanelSource).toContain('averageRating')
        expect(reviewDetailCopySource).toContain(
            "complete: '리뷰가 모두 작성되었어요'"
        )
        expect(reviewDetailCopySource).toContain("privateBadge: '비공개'")
        expect(reviewDetailCopySource).toContain("publicBadge: '공개'")
    })

    it('keeps the detail modal mounted while fade-out animation runs', () => {
        expect(reviewDetailPanelSource).toContain('isClosing')
        expect(reviewDetailPanelSource).toContain('MODAL_CLOSE_ANIMATION_MS')
        expect(reviewDetailPanelSource).toContain('handleClosePanel')
    })
})
