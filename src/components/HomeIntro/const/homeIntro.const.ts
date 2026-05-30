export const HOME_ACTIONS = [
    {
        href: '/login',
        label: '로그인 시작',
        variant: 'primaryAction',
    },
    {
        href: '/app',
        label: '보호된 공간 보기',
        variant: 'secondaryAction',
    },
] as const;

export const HOME_PREVIEW_IMAGES = [
    {
        label: '함께 다녀온 큰 장소 사진',
        variant: 'photoPrimary',
    },
    {
        label: '두 번째 장소 사진',
        variant: 'photoSecondary',
    },
    {
        label: '세 번째 장소 사진',
        variant: 'photoTertiary',
    },
] as const;

export const HOME_MEMORY_META = {
    category: '지난 주말의 카페',
    placeName: '봄빛이 들어오던 창가 자리',
    status: '둘의 리뷰를 기다리는 중',
} as const;
