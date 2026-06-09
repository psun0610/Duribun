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

const getNestedMetadataText = (
    metadata: ProfileUserMetadata,
    parentKey: string,
    childKeys: readonly string[]
) => {
    const parentValue = metadata[parentKey]

    if (!parentValue || typeof parentValue !== 'object') {
        return ''
    }

    const nestedMetadata = parentValue as Record<string, unknown>

    for (const key of childKeys) {
        const value = nestedMetadata[key]

        if (typeof value === 'string' && value.trim()) {
            return value.trim()
        }
    }

    return ''
}

export const getKakaoAccountEmail = ({
    appMetadata,
    userEmail,
    userMetadata,
}: {
    appMetadata: ProfileAppMetadata
    userEmail: string | null
    userMetadata: ProfileUserMetadata
}) => {
    if (appMetadata.provider !== 'kakao') {
        return ''
    }

    return (
        getMetadataText(userMetadata, ['account_email']) ||
        getNestedMetadataText(userMetadata, 'kakao_account', [
            'account_email',
            'email',
        ]) ||
        userEmail ||
        ''
    ).trim()
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
    const kakaoAccountEmail = getKakaoAccountEmail({
        appMetadata,
        userEmail,
        userMetadata,
    })
    const email =
        profile?.email || kakaoAccountEmail || (isEmailAuth ? userEmail || '' : '')
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
        isEmailDisabled: Boolean(kakaoAccountEmail),
    }
}
