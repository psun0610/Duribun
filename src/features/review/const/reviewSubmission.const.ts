import type {
    ReviewCategory,
    ReviewTagOption,
} from '../types/reviewSubmission.types'

export const REVIEW_SCORE_OPTIONS = [
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
] as const

export const REVIEW_KIND_OPTIONS = [
    {
        label: '장소/음식',
        value: 'place_food',
    },
    {
        label: '커플/개인',
        value: 'couple_private',
    },
] as const

export const REVIEW_TAG_OPTIONS: Record<ReviewCategory, ReviewTagOption[]> = {
    activity: [
        { label: '분위기', value: '분위기' },
        { label: '재미', value: '재미' },
        { label: '예약 추천', value: '예약 추천' },
        { label: '사진 명소', value: '사진 명소' },
        { label: '데이트 추천', value: '데이트 추천' },
        { label: '다시 가고 싶음', value: '다시 가고 싶음' },
    ],
    cafe: [
        { label: '분위기', value: '분위기' },
        { label: '맛', value: '맛' },
        { label: '서비스', value: '서비스' },
        { label: '가격', value: '가격' },
        { label: '뷰', value: '뷰' },
        { label: '사진 명소', value: '사진 명소' },
    ],
    restaurant: [
        { label: '분위기', value: '분위기' },
        { label: '맛', value: '맛' },
        { label: '서비스', value: '서비스' },
        { label: '가격', value: '가격' },
        { label: '사진 명소', value: '사진 명소' },
        { label: '데이트 추천', value: '데이트 추천' },
    ],
}

export const REVIEW_WRITER_COPY = {
    addPhoto: '사진 추가',
    close: '닫기',
    kindLabel: '사진 유형',
    oneLineLabel: '한 줄 리뷰',
    panelTitle: '리뷰 작성',
    photoHelp:
        '장소/음식 사진과 커플/개인 사진을 구분해 주세요. 공개는 장소/음식 사진만 가능해요.',
    photoLabel: '사진 추가',
    photoLimitHelp: '최대 5장까지 추가할 수 있어요.',
    photoRowLabel: '사진',
    ratingLabel: '별점',
    save: '리뷰 저장하기',
    tagLabel: '카테고리',
    tagsHelp: '이 장소의 매력을 한 줄로 남겨보세요.',
    titlePrefix: '리뷰 작성',
} as const
