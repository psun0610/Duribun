import type {
    ProfileAppMetadata,
    ProfileInitialValues,
    ProfileRowValues,
    ProfileUserMetadata,
} from '../types/profileMetadata.types'

const getMetadataText = (
    metadata: ProfileUserMetadata,
    keys: readonly string[]
) => {
    for (const key of keys) {
        const value = metadata[key]

        if (typeof value === 'string' && value.trim()) {
            return value.trim()
        }
    }

    return ''
}

export const getProfileInitialValues = ({
    appMetadata,
    profile,
    userEmail,
    userMetadata,
}: {
    appMetadata: ProfileAppMetadata
    profile: ProfileRowValues | null
    userEmail: string | null
    userMetadata: ProfileUserMetadata
}): ProfileInitialValues => {
    const authProvider = appMetadata.provider
    const isEmailAuth = authProvider === 'email'
    const email = profile?.email || (isEmailAuth ? userEmail || '' : '')
    const displayName =
        profile?.display_name ||
        getMetadataText(userMetadata, [
            'nickname',
            'name',
            'full_name',
            'preferred_username',
            'user_name',
        ])
    const avatarUrl =
        profile?.avatar_url ||
        getMetadataText(userMetadata, ['avatar_url', 'picture', 'profile_image'])

    return {
        email,
        displayName,
        avatarUrl,
    }
}
