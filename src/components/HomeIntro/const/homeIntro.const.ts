export const HOME_ACTIONS = [
    {
        href: '/login',
        label: '시작하기',
        variant: 'primaryAction',
    },
    {
        href: '/app',
        label: '우리 기록 보기',
        variant: 'secondaryAction',
    },
] as const

export const HOME_PREVIEW_IMAGES = [
    {
        label: '데이트 장소 대표 사진',
        url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop',
        variant: 'photoPrimary',
    },
    {
        label: '함께 먹은 음식 사진',
        url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=700&auto=format&fit=crop',
        variant: 'photoSecondary',
    },
    {
        label: '산책 장소 사진',
        url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=700&auto=format&fit=crop',
        variant: 'photoTertiary',
    },
] as const

export const HOME_MEMORY_META = {
    category: '이번 주말 카페',
    placeName: '청담 루프탑 카페',
    status: '상대의 리뷰를 기다리는 중',
} as const
