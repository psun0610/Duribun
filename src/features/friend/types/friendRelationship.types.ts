export interface FriendActionState {
    errorMessage: string
    friendCode?: string
    succeeded: boolean
}

export interface FriendCoupleFilterSummary {
    enabled: boolean
    friendCoupleId: string
    friendCoupleName: string
}
