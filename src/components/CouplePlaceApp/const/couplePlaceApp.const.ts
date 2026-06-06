import { Compass, Home, Settings, Users, type LucideIcon } from 'lucide-react'

import type {
    ActiveTab,
    CouplePlace,
    PlaceCategory,
    ReviewStatus,
} from '../types/couplePlaceApp.types'

export const MOCK_PLACES: CouplePlace[] = [
    {
        id: 'place-1',
        name: '청담 루프탑 카페',
        category: 'cafe',
        photoUrl:
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop',
        reviewStatus: 'complete',
        rating: 4.5,
        isPublic: true,
        visitDate: '2026-05-28',
        tags: ['분위기 좋아요', '사진 잘 나와요', '루프탑'],
    },
    {
        id: 'place-2',
        name: '성수 파스타 스튜디오',
        category: 'restaurant',
        photoUrl:
            'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&auto=format&fit=crop',
        reviewStatus: 'partner-waiting',
        isPublic: false,
        visitDate: '2026-06-01',
    },
    {
        id: 'place-3',
        name: '북촌 산책길',
        category: 'activity',
        photoUrl:
            'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=900&auto=format&fit=crop',
        reviewStatus: 'waiting-partner',
        isPublic: false,
        visitDate: '2026-05-15',
    },
    {
        id: 'place-4',
        name: '연남 브런치 카페',
        category: 'cafe',
        photoUrl:
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop',
        reviewStatus: 'none',
        isPublic: false,
        visitDate: '2026-06-04',
    },
]

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
    none: '아직 리뷰가 필요해요',
    'waiting-partner': '상대의 리뷰를 기다리는 중',
    'partner-waiting': '상대가 기다리고 있어요',
    complete: '리뷰 완료',
}

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
    restaurant: '식당',
    cafe: '카페',
    activity: '활동',
}

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
