import type { ChangeEvent, RefObject } from 'react'

import type {
    ReviewPhotoKind,
    ReviewTargetPlace,
} from '@/features/review/types/reviewSubmission.types'

export interface ReviewWriterPanelProps {
    onClose: () => void
    place: ReviewTargetPlace
}

export interface ReviewRatingControlProps {
    ariaLabel: string
    onChange: (nextRating: number) => void
    value: number | null
}

export interface ReviewPhotoPreviewItem {
    file: File
    id: string
    kind: ReviewPhotoKind
    previewUrl: string
}

export interface ReviewPhotoGridProps {
    fileInputRef: RefObject<HTMLInputElement | null>
    maxPhotoCount: number
    onAddClick: () => void
    onFilesChange: (event: ChangeEvent<HTMLInputElement>) => void
    onKindChange: (id: string, kind: ReviewPhotoKind) => void
    onRemove: (id: string) => void
    photos: ReviewPhotoPreviewItem[]
}
