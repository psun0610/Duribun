export const formatKoreanDate = (value: string) => {
    return new Intl.DateTimeFormat('ko-KR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value))
}
