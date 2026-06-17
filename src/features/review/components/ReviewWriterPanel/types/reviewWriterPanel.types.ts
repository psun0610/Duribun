import type { ReviewTargetPlace } from '@/features/review/types/reviewSubmission.types'

export interface ReviewWriterPanelProps {
    onClose: () => void
    place: ReviewTargetPlace
}
