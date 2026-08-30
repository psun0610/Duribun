export const LOGIN_PROVIDERS = [
    {
        iconAlt: '카카오',
        iconSrc: '/auth/kakao.svg',
        label: '카카오로 시작하기',
        value: 'kakao',
    },
    {
        iconAlt: '네이버',
        iconSrc: '/auth/naver.svg',
        label: '네이버로 시작하기',
        value: 'naver',
    },
    {
        iconAlt: 'Google',
        iconSrc: '/auth/google.svg',
        label: 'Google로 시작하기',
        value: 'google',
    },
] as const

export const LOGIN_PANEL_COPY = {
    eyebrow: '반가워요',
    title: '어떻게 시작할까요?',
    description: '쓰던 계정으로 바로 들어올 수 있어요.',
    emailLabel: '이메일',
    emailPlaceholder: 'you@example.com',
    emailSubmitLabel: '메일로 링크 받기',
    emailSentMessage: '메일로 링크를 보냈어요. 메일함에서 눌러주세요.',
    heroImageLabel: '함께 장소를 기록하는 커플 이미지',
    socialLabel: '간편하게 시작하기',
    accountHint: '처음이어도 같은 버튼으로 시작해요. 가입 단계는 따로 없어요.',
} as const
