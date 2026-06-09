export interface CoupleSummary {
    friendCode: string
    id: string
    inviteCode: string
    name: string
}

export interface CoupleActionState {
    couple: CoupleSummary | null
    errorMessage: string
}
