import type {
    PlaceCategory,
    PlaceRegistrationState,
    PlaceSearchState,
} from '@/features/place/types/placeRegistration.types'

export const PLACE_CATEGORY_OPTIONS: Array<{
    label: string
    value: PlaceCategory
}> = [
    {
        label: '식당',
        value: 'restaurant',
    },
    {
        label: '카페',
        value: 'cafe',
    },
    {
        label: '활동',
        value: 'activity',
    },
]

export const MODAL_CLOSE_ANIMATION_MS = 220

export const PLACE_REGISTRATION_COPY = {
    addressLabel: '주소',
    addressPlaceholder: '주소',
    categoryLabel: '카테고리',
    close: '닫기',
    confirmPlace: '이 장소로 할까요?',
    loadMore: '더보기',
    manualCta: '직접 입력',
    manualHint: '찾는 장소가 없나요?',
    manualNameLabel: '장소명',
    manualNamePlaceholder: '장소명',
    manualRegister: '장소 추가하기',
    manualTab: '직접 입력',
    manualTitle: '직접 입력',
    noSearchResults: '검색 결과가 없어요',
    panelTitle: '어디를 다녀왔나요?',
    registering: '추가 중...',
    search: '검색',
    searchPlaceholder: '장소를 선택해주세요',
    searchTab: '장소 검색',
    selectAnother: '다른 장소 고르기',
    submitSelectedPlace: '장소 추가하기',
} as const

export const INITIAL_REGISTRATION_STATE: PlaceRegistrationState = {
    errorMessage: '',
    succeeded: false,
}

export const INITIAL_SEARCH_STATE: PlaceSearchState = {
    errorMessage: '',
    isEnd: true,
    page: 0,
    query: '',
    results: [],
}
