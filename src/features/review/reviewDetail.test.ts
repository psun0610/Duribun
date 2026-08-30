import { readFileSync } from 'fs'
import path from 'path'

import { describe, expect, it } from 'vitest'

const appDataSource = readFileSync(
    path.resolve(process.cwd(), 'src/app/app/getProtectedAppData.ts'),
    'utf8'
)
const couplePlaceAppSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/place/components/CouplePlaceApp/CouplePlaceApp.tsx'
    ),
    'utf8'
)
const reviewActionsSource = readFileSync(
    path.resolve(process.cwd(), 'src/features/review/actions.ts'),
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
const reviewDetailPageSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/app/app/places/[couplePlaceId]/review/page.tsx'
    ),
    'utf8'
)
const reviewWriterPageSource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/app/app/places/[couplePlaceId]/review/new/page.tsx'
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
const reviewStatusCopySource = readFileSync(
    path.resolve(process.cwd(), 'src/features/review/const/reviewStatus.const.ts'),
    'utf8'
)
const couplePlaceAppCopySource = readFileSync(
    path.resolve(
        process.cwd(),
        'src/features/place/components/CouplePlaceApp/const/couplePlaceApp.const.ts'
    ),
    'utf8'
)

describe('review detail', () => {
    it('loads review detail data for protected couple places', () => {
        expect(appDataSource).toContain('getCouplePlaceReviewDetailsMap')
        expect(appDataSource).toContain('reviewDetailsByPlaceId')
        expect(reviewDetailPageSource).toContain('currentUserId={appState.data.currentUserId}')
    })

    it('opens a private detail panel with review state copy', () => {
        expect(couplePlaceAppSource).toContain('BottomNavigation')
        expect(couplePlaceAppSource).toContain('AppHeader')
        expect(registeredPlaceCardsSource).toContain(
            'getReviewDetailTargetPlace'
        )
        expect(reviewDetailPanelSource).toContain(
            'REVIEW_STATUS_MESSAGE[detail.reviewStatus]'
        )
    })

    it('uses the documented review status copy from a single definition', () => {
        expect(reviewStatusCopySource).toContain("none: '이 장소는 어땠나요?'")
        expect(reviewStatusCopySource).toContain(
            "'waiting-partner': '상대를 기다리는 중...'"
        )
        expect(reviewStatusCopySource).toContain(
            "'partner-waiting': '상대가 기다리고 있어요'"
        )
        expect(reviewStatusCopySource).toContain("complete: '둘 다 남겼어요'")
    })

    it('keeps every review status label distinct and defined in one place', () => {
        expect(reviewDetailCopySource).not.toContain('REVIEW_STATUS_LABEL')
        expect(couplePlaceAppCopySource).not.toContain('REVIEW_STATUS_LABEL')
        expect(registeredPlaceCardsSource).toContain('REVIEW_STATUS_BADGE')

        const badgeBlock = reviewStatusCopySource
            .split('REVIEW_STATUS_BADGE')[1]
            .split('}')[0]
        const badgeLabels = [...badgeBlock.matchAll(/'([^']+)',/g)].map(
            match => match[1]
        )

        expect(badgeLabels).toHaveLength(4)
        expect(new Set(badgeLabels).size).toBe(4)
    })

    it('shows private one-line reviews, rating metrics, tags, and photos only inside the couple space', () => {
        expect(reviewCardSource).toContain('oneLineReview')
        expect(reviewCardSource).toContain('review.ratings')
        expect(reviewCardSource).toContain('ratingBreakdown')
        expect(reviewCardSource).toContain('photoGrid')
        expect(reviewCardSource).toContain('REVIEW_PHOTO_KIND_LABEL')
        expect(reviewActionsSource).toContain('review_ratings')
        expect(reviewDetailCopySource).toContain("myReview: '내가 남긴 말'")
        expect(reviewDetailCopySource).toContain("partnerReview: '상대가 남긴 말'")
    })

    it('keeps completed review state aligned with average rating and photo visibility rules', () => {
        expect(reviewDetailPanelSource).toContain('averageRating')
        expect(reviewStatusCopySource).toContain("complete: '둘 다 남겼어요'")
        expect(reviewDetailCopySource).toContain("privateBadge: '우리끼리만'")
        expect(reviewDetailCopySource).toContain("publicBadge: '밖에도 보여요'")
    })

    it('routes unrevised registered places to the review writer', () => {
        expect(reviewWriterPageSource).toContain('ReviewWriterRoutePanel')
        expect(registeredPlaceCardsSource).toContain('getReviewTargetPlace')
        expect(registeredPlaceCardsSource).toContain(
            "status === 'none' || status === 'partner-waiting'"
        )
    })

    it('keeps the detail modal mounted while fade-out animation runs', () => {
        expect(reviewDetailPanelSource).toContain('isClosing')
        expect(reviewDetailPanelSource).toContain('MODAL_CLOSE_ANIMATION_MS')
        expect(reviewDetailPanelSource).toContain('handleClosePanel')
    })
})
