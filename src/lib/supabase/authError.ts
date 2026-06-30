export const isStaleRefreshTokenError = (error: unknown) => {
    if (!(error instanceof Error)) {
        return false
    }

    return (
        error.message.includes('Invalid Refresh Token') ||
        error.message.includes('Refresh Token Not Found') ||
        error.message.includes('Already Used')
    )
}
