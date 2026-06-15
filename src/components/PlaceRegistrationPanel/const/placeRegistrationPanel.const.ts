import type { PlaceCategory } from '@/features/place/types/placeRegistration.types'

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

export const PLACE_REGISTRATION_COPY = {
    addressPlaceholder: '주소',
    close: '닫기',
    kakaoBadge: 'Kakao',
    kakaoDescription: '장소명을 검색하고 결과를 골라 우리 장소에 추가해요.',
    kakaoRegister: '추가',
    kakaoTitle: 'Kakao 장소 검색',
    manualBadge: '탐색 승인 전',
    manualDescription:
        '검색에 없는 장소는 직접 추가할 수 있어요. 수동 장소는 승인 또는 Kakao 매칭 전까지 탐색에 노출되지 않습니다.',
    manualNamePlaceholder: '장소 이름',
    manualRegister: '수동 장소 추가',
    manualTitle: '직접 입력',
    noSearchResults: '검색 결과가 없어요. 직접 입력으로 추가해 보세요.',
    panelTitle: '장소 추가',
    roadAddressPlaceholder: '도로명 주소',
    search: '검색',
    searchPlaceholder: '장소명 또는 지역을 입력',
} as const
