export type CoupleMode = 'select' | 'create' | 'join' | 'nickname'

export interface CoupleMatchPageProps {
    onMatchSuccess: () => void
    initialMode?: CoupleMode
}
