import { Compass, Home, Settings, Users, type LucideIcon } from 'lucide-react'

import type {
    ActiveTab,
    CouplePlace,
    PlaceCategory,
    ReviewStatus,
} from '../types/couplePlaceApp.types'

export const MOCK_PLACES: CouplePlace[] = [
    {
        category: 'cafe',
        id: 'place-1',
        isPublic: true,
        name: '청담 루프탑 카페',
        photoUrl:
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop',
        rating: 4.5,
        reviewStatus: 'complete',
        tags: ['분위기 좋아요', '사진 잘 나와요', '루프탑'],
        visitDate: '2026-05-28',
    },
    {
        category: 'restaurant',
        id: 'place-2',
        isPublic: false,
        name: '성수 파스타 스튜디오',
        photoUrl:
            'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&auto=format&fit=crop',
        reviewStatus: 'partner-waiting',
        visitDate: '2026-06-01',
    },
    {
        category: 'activity',
        id: 'place-3',
        isPublic: false,
        name: '북촌 유리공방',
        photoUrl:
            'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=900&auto=format&fit=crop',
        reviewStatus: 'waiting-partner',
        visitDate: '2026-05-15',
    },
    {
        category: 'cafe',
        id: 'place-4',
        isPublic: false,
        name: '연남 브런치 카페',
        photoUrl:
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop',
        reviewStatus: 'none',
        visitDate: '2026-06-04',
    },
]

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
    complete: '리뷰 완료',
    none: '이 장소는 어땠나요?',
    'partner-waiting': '상대가 기다리고 있어요.',
    'waiting-partner': '상대를 기다리는 중...',
}

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
    activity: '활동',
    cafe: '카페',
    restaurant: '식당',
}

export const PROVIDER_LABEL = {
    kakao: 'Kakao 등록',
    manual: '직접 입력',
} as const

export const COUPLE_PLACE_APP_COPY = {
    addPlace: '장소 추가',
    appTitle: '두리번',
    exploreDescription:
        '다른 커플들이 공개한 데이트 장소를 발견하는 공간입니다.',
    exploreTitle: '새로운 장소 탐색',
    feedView: '피드 보기',
    friendDescription:
        '친구 코드를 연결하면 서로의 공개 가능한 추천 장소를 볼 수 있어요.',
    friendTitle: '친구 커플 추천',
    listView: '리스트 보기',
    logout: '로그아웃',
    manualExplorePending: '탐색 승인 전',
    private: '비공개',
    public: '공개',
    recordSuffix: '의 데이트 기록',
    requestDisconnect: '커플 연결 해제 요청',
    settingsDescription: '프로필과 커플 공간을 관리합니다.',
    settingsTitle: '설정',
} as const

export const TAB_ITEMS: Array<{
    icon: LucideIcon
    label: string
    value: ActiveTab
}> = [
    {
        icon: Home,
        label: '우리',
        value: 'places',
    },
    {
        icon: Users,
        label: '친구',
        value: 'friends',
    },
    {
        icon: Compass,
        label: '탐색',
        value: 'explore',
    },
    {
        icon: Settings,
        label: '설정',
        value: 'settings',
    },
]
