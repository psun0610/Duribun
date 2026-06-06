import type { User } from '@supabase/supabase-js'

export interface ProfileInitialValues {
    email: string
    displayName: string
    avatarUrl: string
}

export interface ProfileRowValues {
    email: string
    display_name: string
    avatar_url: string | null
}

export type ProfileAppMetadata = User['app_metadata']
export type ProfileUserMetadata = User['user_metadata']
