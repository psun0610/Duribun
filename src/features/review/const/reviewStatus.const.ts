import type { ReviewStatus } from '@/features/review/types/reviewDetail.types'

/**
 * 리뷰 상태 문구의 단일 정의입니다.
 * 문구는 docs/product-decisions.md의 "Review Status Copy"를 따릅니다.
 *
 * - none: 둘 다 미작성
 * - waiting-partner: 나만 작성, 상대를 기다리는 중
 * - partner-waiting: 상대만 작성, 상대가 나를 기다리는 중
 * - complete: 둘 다 작성
 */
export const REVIEW_STATUS_MESSAGE: Record<ReviewStatus, string> = {
    complete: '리뷰 작성 완료',
    none: '이 장소는 어땠나요?',
    'partner-waiting': '상대가 기다리고 있어요',
    'waiting-partner': '상대를 기다리는 중...',
}

/** 장소 카드 뱃지처럼 좁은 자리에 쓰는 짧은 라벨입니다. */
export const REVIEW_STATUS_BADGE: Record<ReviewStatus, string> = {
    complete: '작성 완료',
    none: '작성 전',
    'partner-waiting': '내 차례',
    'waiting-partner': '상대 기다리는 중',
}

export const REVIEW_AUTHOR_STATUS_LABEL = {
    done: '작성 완료',
    pending: '작성 전',
} as const
