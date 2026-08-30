import {
    Building2,
    Coffee,
    Compass,
    Grid3X3,
    Heart,
    Home,
    Settings,
    Trees,
    Users,
    Utensils,
    type LucideIcon,
} from 'lucide-react'

import type {
    ActiveTab,
    CouplePlace,
    PlaceCategory,
} from '../types/couplePlaceApp.types'

export const MOCK_PLACES: CouplePlace[] = [
    {
        category: 'cafe',
        id: 'place-1',
        isPublic: true,
        name: '오션뷰 브런치 카페',
        photoUrl:
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop',
        rating: 4.5,
        reviewStatus: 'complete',
        tags: ['분위기', '사진 명소', '뷰'],
        visitDate: '2026.05.12',
    },
    {
        category: 'restaurant',
        id: 'place-2',
        isPublic: false,
        name: '숲속 산책길',
        photoUrl:
            'https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&auto=format&fit=crop',
        rating: 4.7,
        reviewStatus: 'partner-waiting',
        visitDate: '2026.05.03',
    },
    {
        category: 'activity',
        id: 'place-3',
        isPublic: true,
        name: '노을 맛집 루프탑',
        photoUrl:
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop',
        rating: 4.8,
        reviewStatus: 'waiting-partner',
        visitDate: '2026.04.28',
    },
    {
        category: 'cafe',
        id: 'place-4',
        isPublic: false,
        name: '감성 독립서점',
        photoUrl:
            'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=900&auto=format&fit=crop',
        reviewStatus: 'none',
        visitDate: '2026.04.20',
    },
]

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
    activity: '활동',
    cafe: '카페',
    restaurant: '식당',
}

export const COUPLE_PLACE_APP_COPY = {
    addPlace: '장소 담기',
    appTitle: '두리번',
    exploreDescription: '다른 커플이 좋았다고 남긴 곳들이에요.',
    exploreEmptyDescription:
        '다른 조건으로 찾아보거나, 조금만 기다려 주세요.',
    exploreEmptyTitle: '아직 보여드릴 곳이 없어요',
    exploreRegionAll: '어디든',
    exploreSearchPlaceholder: '가고 싶은 동네나 이름으로 찾기',
    exploreSortLabel: '정렬 기준',
    exploreTitle: '둘러보기',
    feedView: '사진으로 보기',
    feedViewShort: '사진으로',
    addFriendCode: '더하기',
    addFriendCodeLabel: '친구 코드',
    addFriendCodePlaceholder: '받은 친구 코드를 넣어보세요',
    addFriendCodeSuccess: '친구를 더했어요.',
    copyFriendCode: '복사',
    friendCodeCopied: '복사했어요',
    friendCodeDescription:
        '이 코드를 건네면, 서로 보여주기로 한 곳만 볼 수 있어요.',
    friendCodeTitle: '우리 코드',
    friendDescription:
        '친구와 코드를 나누면, 서로 보여주기로 한 곳만 볼 수 있어요.',
    friendEmptyDescription:
        '친구를 더하거나 필터를 켜면 여기에 보여요.',
    friendEmptyTitle: '아직 보여드릴 곳이 없어요',
    friendTitle: '친구가 다녀온 곳',
    listView: '목록으로 보기',
    listViewShort: '목록으로',
    logout: '로그아웃',
    manualExplorePending: '확인 중이에요',
    notification: '알림',
    placesTitle: '우리가 다녀온 곳',
    private: '우리끼리만',
    public: '밖에도 보여요',
    recordSuffix: '곳',
    regenerateFriendCode: '새로 만들기',
    requestDisconnect: '연결 끊기',
    settingsDescription: '프로필과 우리 공간을 관리해요.',
    settingsTitle: '설정',
    tabTitle: {
        explore: '둘러보기',
        friends: '친구가 다녀온 곳',
        places: '',
        settings: '설정',
    },
    viewModeLabel: '보기 방식',
} as const

export const EXPLORE_SORT_OPTIONS = [
    {
        label: '추천순',
        value: 'recommended',
    },
    {
        label: '평점순',
        value: 'rating',
    },
    {
        label: '최신순',
        value: 'latest',
    },
] as const

export const EXPLORE_CATEGORY_OPTIONS = [
    {
        icon: Grid3X3,
        label: '전체',
        value: 'all',
    },
    {
        icon: Coffee,
        label: CATEGORY_LABEL.cafe,
        value: 'cafe',
    },
    {
        icon: Utensils,
        label: '맛집',
        value: 'restaurant',
    },
    {
        icon: Heart,
        label: '데이트',
        value: 'activity',
    },
    {
        icon: Trees,
        label: '자연',
        value: 'nature',
    },
    {
        icon: Building2,
        label: '문화',
        value: 'culture',
    },
] as const

export const EXPLORE_REGION_OPTIONS = ['서울', '부산', '대구', '제주'] as const

export const TAB_ITEMS: Array<{
    icon: LucideIcon
    label: string
    value: ActiveTab
}> = [
    {
        icon: Home,
        label: '홈',
        value: 'places',
    },
    {
        icon: Users,
        label: '친구',
        value: 'friends',
    },
    {
        icon: Compass,
        label: '둘러보기',
        value: 'explore',
    },
    {
        icon: Settings,
        label: '설정',
        value: 'settings',
    },
]
