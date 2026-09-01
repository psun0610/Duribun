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
    categoryLabel: '어떤 곳인가요?',
    close: '닫기',
    confirmPlace: '여기 맞나요?',
    loadMore: '더보기',
    manualCta: '직접 적기',
    manualHint: '찾는 곳이 안 보이나요?',
    manualHintSub: '이름만 적어서 담아도 괜찮아요',
    resultsLabel: '이 중에 있나요?',
    manualNameLabel: '이름',
    manualNamePlaceholder: '어디였나요?',
    manualRegister: '담기',
    manualTab: '직접 적기',
    manualTitle: '직접 적기',
    noSearchResults: '검색 결과가 없어요',
    panelTitle: '어디 다녀오셨어요?',
    registering: '담는 중이에요',
    search: '검색',
    searchPlaceholder: '가게 이름으로 찾아보세요',
    searchTab: '찾아서 담기',
    selectAnother: '다른 곳 고르기',
    submitSelectedPlace: '여기로 담기',
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
