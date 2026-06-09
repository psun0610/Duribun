export type ProfileSetupStep = 'identity' | 'avatar'

export interface ProfileFormState {
    avatarUrl: string
    errorMessage: string
}
