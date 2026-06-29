import type { ReviewStatus } from '@/features/review/types/reviewDetail.types'

export const MODAL_CLOSE_ANIMATION_MS = 220

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
    complete: '작성 완료',
    none: '작성 전',
    'partner-waiting': '상대 기다림',
    'waiting-partner': '내가 작성할 차례',
}

export const REVIEW_DETAIL_COPY = {
    averageRating: '평균 평점',
    close: '닫기',
    myReview: '내 리뷰',
    myReviewShort: '나',
    noDetail: '상세 정보를 불러오지 못했어요.',
    noReview: '아직 작성된 리뷰가 없어요.',
    oneLineLabel: '한 줄 리뷰',
    ourReviewStatus: '우리의 리뷰 상태',
    partnerReview: '상대 리뷰',
    partnerReviewShort: '상대',
    photosTitle: '사진',
    privacyNotice:
        '프라이버시 규칙은 엄격하게 유지돼요. 기본값은 비공개이고, 공개는 규칙을 충족해야만 가능해요.',
    privateBadge: '비공개',
    privateLabel: '비공개',
    publicBadge: '공개',
    publicLabel: '공개',
    ratingLabel: '평점',
    reviewCount: '작성 완료',
    reviewTitle: '장소 상세',
    shareReady: '공개 가능',
    shareTitle: '공개 설정',
    shareWaiting: '공개 조건 대기',
    tagsTitle: '태그',
    turnPrivate: '변경',
    turnPublic: '변경',
} as const

export const REVIEW_PHOTO_KIND_LABEL = {
    couple_private: '커플/개인',
    place_food: '장소/음식',
} as const
