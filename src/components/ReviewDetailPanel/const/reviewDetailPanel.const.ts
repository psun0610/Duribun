import type { ReviewStatus } from '@/features/review/types/reviewDetail.types'

export const MODAL_CLOSE_ANIMATION_MS = 220

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
    complete: '리뷰가 모두 작성되었어요',
    none: '리뷰를 작성해 주세요!',
    'partner-waiting': '상대가 리뷰를 기다리고 있어요',
    'waiting-partner': '아직 상대가 작성하지 않았어요',
}

export const REVIEW_DETAIL_COPY = {
    averageRating: '평균 평점',
    close: '닫기',
    myReview: '내 리뷰',
    partnerReview: '상대 리뷰',
    privateBadge: '비공개',
    publicBadge: '공개',
    reviewTitle: '리뷰 상세',
    tagsTitle: '태그',
    photosTitle: '사진',
    noReview: '아직 작성된 리뷰가 없어요',
    noDetail: '상세 정보를 불러오지 못했어요.',
    reviewCount: '작성 완료',
    ratingLabel: '평점',
    oneLineLabel: '한 줄 리뷰',
    privateLabel: '비공개',
    publicLabel: '공개',
    shareReady: '공개 전환 가능',
    shareWaiting: '공개 조건 대기',
    shareTitle: '공유 설정',
    turnPrivate: '비공개로 전환',
    turnPublic: '공개로 전환',
} as const

export const REVIEW_PHOTO_KIND_LABEL = {
    couple_private: '커플/비공개',
    place_food: '장소/음식',
} as const
