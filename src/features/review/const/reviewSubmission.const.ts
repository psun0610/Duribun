import type { ReviewCategory, ReviewTagOption } from '../types/reviewSubmission.types'

export const REVIEW_SCORE_OPTIONS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'] as const

export const REVIEW_KIND_OPTIONS = [
    {
        label: '장소/음식',
        value: 'place_food',
    },
    {
        label: '커플/비공개',
        value: 'couple_private',
    },
] as const

export const REVIEW_TAG_OPTIONS: Record<ReviewCategory, ReviewTagOption[]> = {
    restaurant: [
        { label: '분위기 좋아요', value: '분위기 좋아요' },
        { label: '데이트 추천', value: '데이트 추천' },
        { label: '음식이 맛있어요', value: '음식이 맛있어요' },
        { label: '가성비 좋아요', value: '가성비 좋아요' },
        { label: '예약하기 좋아요', value: '예약하기 좋아요' },
        { label: '재방문 의사 있어요', value: '재방문 의사 있어요' },
    ],
    cafe: [
        { label: '사진 잘 나와요', value: '사진 잘 나와요' },
        { label: '디저트가 맛있어요', value: '디저트가 맛있어요' },
        { label: '대화하기 좋아요', value: '대화하기 좋아요' },
        { label: '조용해요', value: '조용해요' },
        { label: '좌석이 편해요', value: '좌석이 편해요' },
        { label: '감성적이에요', value: '감성적이에요' },
    ],
    activity: [
        { label: '추억 남기기 좋아요', value: '추억 남기기 좋아요' },
        { label: '이색 데이트', value: '이색 데이트' },
        { label: '체험이 재밌어요', value: '체험이 재밌어요' },
        { label: '예약이 쉬워요', value: '예약이 쉬워요' },
        { label: '비 오는 날 추천', value: '비 오는 날 추천' },
        { label: '색다른 경험', value: '색다른 경험' },
    ],
}

export const REVIEW_WRITER_COPY = {
    addPhoto: '사진 추가',
    close: '닫기',
    kindLabel: '사진 유형',
    oneLineLabel: '한 줄 리뷰',
    photoHelp: '사진은 최소 1장 필요하고, 각 사진마다 유형을 선택해야 합니다.',
    photoLabel: '사진',
    photoRowLabel: '사진',
    panelTitle: '리뷰 작성',
    photoLimitHelp: '최대 5장까지 추가할 수 있어요.',
    ratingLabel: '평점',
    save: '리뷰 저장',
    tagLabel: '태그',
    tagsHelp: '태그는 하나 이상 선택해 주세요.',
    titlePrefix: '리뷰 작성',
} as const
