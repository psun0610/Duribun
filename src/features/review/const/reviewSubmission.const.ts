import type {
    ReviewCategory,
    ReviewRatingOption,
    ReviewTagOption,
} from '../types/reviewSubmission.types'

/**
 * 새로 추가한 사진의 기본 유형입니다.
 * 기본값은 항상 비공개(couple_private)여야 합니다. 사용자가 유형을 바꾸지 않은
 * 사진이 커플 공간 밖으로 나가는 일이 없도록, 공개 후보가 되려면 반드시
 * 명시적으로 place_food를 선택하게 합니다.
 */
export const DEFAULT_REVIEW_PHOTO_KIND = 'couple_private'

export const REVIEW_KIND_OPTIONS = [
    {
        label: '장소·음식',
        value: 'place_food',
    },
    {
        label: '우리끼리',
        value: 'couple_private',
    },
] as const

export const REVIEW_RATING_OPTIONS: Record<
    ReviewCategory,
    ReviewRatingOption[]
> = {
    activity: [
        { key: 'fun', label: '재미' },
        { key: 'accessibility', label: '접근성' },
        { key: 'value', label: '가성비' },
        { key: 'satisfaction', label: '만족도' },
    ],
    cafe: [
        { key: 'coffee', label: '커피맛' },
        { key: 'dessert', label: '디저트' },
        { key: 'mood', label: '분위기' },
        { key: 'seat_comfort', label: '좌석편의' },
        { key: 'satisfaction', label: '만족도' },
    ],
    restaurant: [
        { key: 'taste', label: '맛' },
        { key: 'cleanliness', label: '청결도' },
        { key: 'value', label: '가성비' },
        { key: 'satisfaction', label: '만족도' },
    ],
}

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
    addPhoto: '사진 넣기',
    close: '닫기',
    kindLabel: '어디까지 보여줄까요?',
    oneLineLabel: '한 줄로 남긴다면?',
    panelTitle: '어땠는지 들려주세요',
    photoHelp:
        '사진마다 어디까지 보여줄지 골라주세요. 밖으로 나갈 수 있는 건 장소·음식 사진뿐이에요.',
    photoLabel: '사진도 남겨볼까요?',
    photoLimitHelp: '10장까지 담을 수 있어요.',
    photoRowLabel: '사진',
    ratingHelp: '별로 알려주세요. 반 칸도 괜찮아요.',
    ratingLabel: '얼마나 좋았나요?',
    save: '리뷰 남기기',
    tagLabel: '어떤 점이 좋았나요?',
    tagsHelp: '여러 개 골라도 돼요.',
} as const
