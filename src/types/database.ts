export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            couple_members: {
                Row: {
                    couple_id: string;
                    joined_at: string;
                    user_id: string;
                };
                Insert: {
                    couple_id: string;
                    joined_at?: string;
                    user_id: string;
                };
                Update: {
                    couple_id?: string;
                    joined_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            couples: {
                Row: {
                    created_at: string;
                    delete_after: string | null;
                    disconnect_requested_at: string | null;
                    disconnect_requested_by: string | null;
                    friend_code: string;
                    friend_code_rotated_at: string | null;
                    id: string;
                    invite_code: string;
                    name: string;
                    status: Database['public']['Enums']['couple_status'];
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    delete_after?: string | null;
                    disconnect_requested_at?: string | null;
                    disconnect_requested_by?: string | null;
                    friend_code: string;
                    friend_code_rotated_at?: string | null;
                    id?: string;
                    invite_code: string;
                    name: string;
                    status?: Database['public']['Enums']['couple_status'];
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    delete_after?: string | null;
                    disconnect_requested_at?: string | null;
                    disconnect_requested_by?: string | null;
                    friend_code?: string;
                    friend_code_rotated_at?: string | null;
                    id?: string;
                    invite_code?: string;
                    name?: string;
                    status?: Database['public']['Enums']['couple_status'];
                    updated_at?: string;
                };
                Relationships: [];
            };
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    display_name: string;
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    display_name: string;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    display_name?: string;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: {
            create_couple: {
                Args: {
                    p_name: string;
                };
                Returns: string;
            };
            current_couple_id: {
                Args: Record<PropertyKey, never>;
                Returns: string | null;
            };
            join_couple_by_invite_code: {
                Args: {
                    p_invite_code: string;
                };
                Returns: string;
            };
        };
        Enums: {
            place_category: 'restaurant' | 'cafe' | 'activity';
            place_provider: 'kakao' | 'manual';
            photo_kind: 'place_food' | 'couple_private';
            couple_status: 'active' | 'disconnect_pending';
        };
        CompositeTypes: Record<string, never>;
    };
};
