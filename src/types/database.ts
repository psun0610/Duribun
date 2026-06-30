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
            couple_friendships: {
                Row: {
                    couple_a_id: string;
                    couple_b_id: string;
                    created_at: string;
                    created_by: string;
                    id: string;
                };
                Insert: {
                    couple_a_id: string;
                    couple_b_id: string;
                    created_at?: string;
                    created_by: string;
                    id?: string;
                };
                Update: {
                    couple_a_id?: string;
                    couple_b_id?: string;
                    created_at?: string;
                    created_by?: string;
                    id?: string;
                };
                Relationships: [];
            };
            friend_couple_filters: {
                Row: {
                    enabled: boolean;
                    friend_couple_id: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    enabled?: boolean;
                    friend_couple_id: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    enabled?: boolean;
                    friend_couple_id?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            review_photos: {
                Row: {
                    created_at: string;
                    height: number | null;
                    id: string;
                    kind: Database['public']['Enums']['photo_kind'];
                    review_id: string;
                    storage_path: string;
                    width: number | null;
                };
                Insert: {
                    created_at?: string;
                    height?: number | null;
                    id?: string;
                    kind: Database['public']['Enums']['photo_kind'];
                    review_id: string;
                    storage_path: string;
                    width?: number | null;
                };
                Update: {
                    created_at?: string;
                    height?: number | null;
                    id?: string;
                    kind?: Database['public']['Enums']['photo_kind'];
                    review_id?: string;
                    storage_path?: string;
                    width?: number | null;
                };
                Relationships: [];
            };
            review_tags: {
                Row: {
                    review_id: string;
                    tag_id: string;
                };
                Insert: {
                    review_id: string;
                    tag_id: string;
                };
                Update: {
                    review_id?: string;
                    tag_id?: string;
                };
                Relationships: [];
            };
            reviews: {
                Row: {
                    author_id: string;
                    couple_place_id: string;
                    created_at: string;
                    id: string;
                    one_line_review: string;
                    rating: number;
                    updated_at: string;
                };
                Insert: {
                    author_id: string;
                    couple_place_id: string;
                    created_at?: string;
                    id?: string;
                    one_line_review: string;
                    rating: number;
                    updated_at?: string;
                };
                Update: {
                    author_id?: string;
                    couple_place_id?: string;
                    created_at?: string;
                    id?: string;
                    one_line_review?: string;
                    rating?: number;
                    updated_at?: string;
                };
                Relationships: [];
            };
            tags: {
                Row: {
                    category: Database['public']['Enums']['place_category'] | null;
                    created_at: string;
                    id: string;
                    label: string;
                    sort_order: number;
                };
                Insert: {
                    category?: Database['public']['Enums']['place_category'] | null;
                    created_at?: string;
                    id?: string;
                    label: string;
                    sort_order?: number;
                };
                Update: {
                    category?: Database['public']['Enums']['place_category'] | null;
                    created_at?: string;
                    id?: string;
                    label?: string;
                    sort_order?: number;
                };
                Relationships: [];
            };
            couple_places: {
                Row: {
                    couple_id: string;
                    created_at: string;
                    created_by: string;
                    id: string;
                    is_public: boolean;
                    place_id: string;
                    updated_at: string;
                };
                Insert: {
                    couple_id: string;
                    created_at?: string;
                    created_by: string;
                    id?: string;
                    is_public?: boolean;
                    place_id: string;
                    updated_at?: string;
                };
                Update: {
                    couple_id?: string;
                    created_at?: string;
                    created_by?: string;
                    id?: string;
                    is_public?: boolean;
                    place_id?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'couple_places_place_id_fkey';
                        columns: ['place_id'];
                        referencedRelation: 'places';
                        referencedColumns: ['id'];
                    },
                ];
            };
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
            places: {
                Row: {
                    address: string | null;
                    category: Database['public']['Enums']['place_category'];
                    created_at: string;
                    created_by: string | null;
                    id: string;
                    is_explore_approved: boolean;
                    latitude: number | null;
                    longitude: number | null;
                    name: string;
                    place_url: string | null;
                    provider: Database['public']['Enums']['place_provider'];
                    provider_category_name: string | null;
                    provider_place_id: string | null;
                    road_address: string | null;
                    updated_at: string;
                };
                Insert: {
                    address?: string | null;
                    category: Database['public']['Enums']['place_category'];
                    created_at?: string;
                    created_by?: string | null;
                    id?: string;
                    is_explore_approved?: boolean;
                    latitude?: number | null;
                    longitude?: number | null;
                    name: string;
                    place_url?: string | null;
                    provider: Database['public']['Enums']['place_provider'];
                    provider_category_name?: string | null;
                    provider_place_id?: string | null;
                    road_address?: string | null;
                    updated_at?: string;
                };
                Update: {
                    address?: string | null;
                    category?: Database['public']['Enums']['place_category'];
                    created_at?: string;
                    created_by?: string | null;
                    id?: string;
                    is_explore_approved?: boolean;
                    latitude?: number | null;
                    longitude?: number | null;
                    name?: string;
                    place_url?: string | null;
                    provider?: Database['public']['Enums']['place_provider'];
                    provider_category_name?: string | null;
                    provider_place_id?: string | null;
                    road_address?: string | null;
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
        Views: {
            friend_couple_filter_summaries: {
                Row: {
                    created_at: string;
                    enabled: boolean;
                    friend_couple_id: string;
                    friend_couple_name: string;
                };
                Relationships: [];
            };
            explore_couple_place_summaries: {
                Row: {
                    address: string | null;
                    average_rating: number | null;
                    category: Database['public']['Enums']['place_category'];
                    couple_id: string;
                    couple_name: string;
                    couple_place_id: string;
                    latitude: number | null;
                    longitude: number | null;
                    place_id: string;
                    place_name: string;
                    place_url: string | null;
                    public_photo_paths: string[] | null;
                    review_count: number;
                    road_address: string | null;
                    tags: string[] | null;
                    updated_at: string | null;
                };
                Relationships: [];
            };
            friend_couple_place_summaries: {
                Row: {
                    address: string | null;
                    average_rating: number | null;
                    category: Database['public']['Enums']['place_category'];
                    couple_id: string;
                    couple_name: string;
                    couple_place_id: string;
                    latitude: number | null;
                    longitude: number | null;
                    place_id: string;
                    place_name: string;
                    place_url: string | null;
                    public_photo_paths: string[] | null;
                    review_count: number;
                    road_address: string | null;
                    tags: string[] | null;
                    updated_at: string | null;
                };
                Relationships: [];
            };
        };
        Functions: {
            create_couple: {
                Args: {
                    p_name: string;
                };
                Returns: string;
            };
            create_friendship_by_friend_code: {
                Args: {
                    p_friend_code: string;
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
            regenerate_friend_code: {
                Args: Record<PropertyKey, never>;
                Returns: string;
            };
            request_couple_disconnect: {
                Args: Record<PropertyKey, never>;
                Returns: undefined;
            };
            cancel_couple_disconnect: {
                Args: Record<PropertyKey, never>;
                Returns: undefined;
            };
            delete_expired_disconnected_couples: {
                Args: Record<PropertyKey, never>;
                Returns: number;
            };
            register_kakao_couple_place: {
                Args: {
                    p_address?: string | null;
                    p_category: Database['public']['Enums']['place_category'];
                    p_latitude?: number | null;
                    p_longitude?: number | null;
                    p_name: string;
                    p_place_url?: string | null;
                    p_provider_category_name?: string | null;
                    p_provider_place_id: string;
                    p_road_address?: string | null;
                };
                Returns: string;
            };
            register_manual_couple_place: {
                Args: {
                    p_address?: string | null;
                    p_category: Database['public']['Enums']['place_category'];
                    p_name: string;
                    p_road_address?: string | null;
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
