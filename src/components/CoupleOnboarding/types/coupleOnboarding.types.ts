import type { CoupleSummary } from '@/features/couple/types/coupleOnboarding.types'

export interface CoupleOnboardingProps {
    initialCouple: CoupleSummary | null
    userLabel: string
}

export type CoupleOnboardingMode = 'select' | 'create' | 'join'
