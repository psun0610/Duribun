import type { ProfileInitialValues } from '@/features/profile/types/profileMetadata.types'

export interface ProfileSetupFormProps {
    initialValues: ProfileInitialValues
}

export interface AvatarFileFieldProps {
    initialAvatarUrl: string
    inputId: string
    label: string
}
