import type { Database } from '@/types/database'

export type ReviewPhotoKind = Database['public']['Enums']['photo_kind']
export type ReviewCategory = Database['public']['Enums']['place_category']

export interface ReviewPhotoInput {
    file: File
    kind: ReviewPhotoKind
}

export interface ReviewSubmissionState {
    errorMessage: string
    successMessage: string
}

export interface ReviewTargetPlace {
    category: ReviewCategory
    couplePlaceId: string
    name: string
}

export interface ReviewTagOption {
    label: string
    value: string
}
