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
            profiles: {
                Row: {
                    id: string;
                    display_name: string;
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    display_name: string;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    display_name?: string;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            place_category: 'restaurant' | 'cafe' | 'activity';
            place_provider: 'kakao' | 'manual';
            photo_kind: 'place_food' | 'couple_private';
            couple_status: 'active' | 'disconnect_pending';
        };
        CompositeTypes: Record<string, never>;
    };
};
