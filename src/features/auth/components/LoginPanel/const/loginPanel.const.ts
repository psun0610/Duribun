export const LOGIN_PROVIDERS = [
    {
        iconAlt: '카카오',
        iconSrc: '/auth/kakao.svg',
        label: '카카오로 로그인',
        value: 'kakao',
    },
    {
        iconAlt: '네이버',
        iconSrc: '/auth/naver.svg',
        label: '네이버로 로그인',
        value: 'naver',
    },
    {
        iconAlt: 'Google',
        iconSrc: '/auth/google.svg',
        label: 'Google로 로그인',
        value: 'google',
    },
] as const

export const LOGIN_PANEL_COPY = {
    eyebrow: 'Get started',
    title: '시작하기',
    description: '로그인 혹은 회원가입을 해 주세요.',
    emailLabel: '이메일',
    emailPlaceholder: 'you@example.com',
    emailSubmitLabel: '이메일로 계속하기',
    emailSentMessage:
        '로그인 링크를 보냈어요. 메일함에서 링크를 눌러 계속하세요.',
    heroImageLabel: '함께 장소를 기록하는 커플 이미지',
    socialLabel: '간편 로그인',
    accountHint:
        '처음 방문한 경우에도 같은 버튼으로 시작할 수 있어요. 별도 회원가입 단계는 없어요.',
} as const
