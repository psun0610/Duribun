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

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
    complete: '작성 완료',
    none: '내가 작성할 차례',
    'partner-waiting': '상대 기다림',
    'waiting-partner': '내가 작성할 차례',
}

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
    activity: '활동',
    cafe: '카페',
    restaurant: '식당',
}

export const COUPLE_PLACE_APP_COPY = {
    addPlace: '장소 추가',
    appTitle: '두리번',
    exploreDescription: '다른 커플들이 공개한 좋은 장소를 발견하는 공간입니다.',
    exploreEmptyDescription:
        '필터를 바꾸거나 공개 가능한 장소가 쌓이면 탐색 추천이 표시돼요.',
    exploreEmptyTitle: '아직 표시할 탐색 추천이 없어요',
    exploreRegionAll: '전체 지역',
    exploreSortLabel: '탐색 정렬',
    exploreTitle: '새로운 장소 탐색',
    feedView: '피드 보기',
    feedViewShort: '피드',
    addFriendCode: '친구 추가',
    addFriendCodeLabel: '친구 커플 코드',
    addFriendCodePlaceholder: '예: DURI7A',
    addFriendCodeSuccess: '친구 커플을 추가했어요.',
    copyFriendCode: '코드 복사',
    friendCodeCopied: '복사 완료',
    friendCodeDescription:
        '이 코드를 공유하면 친구 커플이 공개 가능한 장소만 볼 수 있어요.',
    friendCodeTitle: '우리 친구 코드',
    friendDescription:
        '친구 커플과 연결하면 서로 공개 가능한 추천 장소를 볼 수 있어요.',
    friendEmptyDescription:
        '친구 커플을 추가하거나 필터를 켜면 공개 가능한 추천 장소가 표시돼요.',
    friendEmptyTitle: '아직 표시할 추천이 없어요',
    friendTitle: '친구 커플 추천',
    listView: '리스트 보기',
    listViewShort: '리스트',
    logout: '로그아웃',
    manualExplorePending: '탐색 승인 중',
    placesTitle: '우리 장소',
    private: '비공개',
    public: '공개',
    recordSuffix: '개의 장소 기록',
    regenerateFriendCode: '새 코드 생성',
    requestDisconnect: '커플 연결 해제 요청',
    settingsDescription: '프로필과 커플 공간을 관리합니다.',
    settingsTitle: '설정',
    viewModeLabel: '장소 보기 방식',
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
        label: '전체',
        value: 'all',
    },
    {
        label: CATEGORY_LABEL.cafe,
        value: 'cafe',
    },
    {
        label: CATEGORY_LABEL.restaurant,
        value: 'restaurant',
    },
    {
        label: CATEGORY_LABEL.activity,
        value: 'activity',
    },
] as const

export const EXPLORE_REGION_OPTIONS = [
    '서울',
    '부산',
    '대구',
    '제주',
] as const

export const TAB_ITEMS: Array<{
    icon: LucideIcon
    label: string
    value: ActiveTab
}> = [
    {
        icon: Home,
        label: '우리 장소',
        value: 'places',
    },
    {
        icon: Users,
        label: '친구 추천',
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
