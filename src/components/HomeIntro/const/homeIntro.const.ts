export const HOME_COPY = {
    brand: '두리번',
    title: '둘이 다녀온 곳,\n여기 다 모아둘게요',
    description:
        '사진 한 장이랑 한 줄이면 충분해요.\n보여줄 곳만 골라서 보여줄 수 있어요.',
    collageLabel: '바다 풍경과 노을 사진 두 장이 겹쳐 있는 그림',
    statusChip: '상대 리뷰를 기다리는 중',
    privacyCaption: '기록은 기본이 비공개예요.',
} as const

export const HOME_ACTIONS = [
    {
        href: '/login',
        label: '우리 공간 만들기',
        variant: 'primaryAction',
    },
    {
        href: '/app',
        label: '이미 쓰고 있어요',
        variant: 'secondaryAction',
    },
] as const
