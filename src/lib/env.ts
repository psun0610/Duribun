type RequiredEnvKey =
    | 'NEXT_PUBLIC_SUPABASE_URL'
    | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    | 'NEXT_PUBLIC_SITE_URL'

export const getEnv = (name: RequiredEnvKey) => {
    const value = process.env[name]

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }

    return value
}

export const getSiteUrl = () => {
    return getEnv('NEXT_PUBLIC_SITE_URL').replace(/\/$/, '')
}
