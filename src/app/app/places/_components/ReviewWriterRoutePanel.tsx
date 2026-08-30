'use client'

import { ReviewWriterPanel } from '@/features/review/components/ReviewWriterPanel'
import type { ReviewTargetPlace } from '@/features/review/types/reviewSubmission.types'

import { useModalRouteClose } from './useModalRouteClose'

interface ReviewWriterRoutePanelProps {
    place: ReviewTargetPlace
}

export const ReviewWriterRoutePanel = ({
    place,
}: ReviewWriterRoutePanelProps) => {
    const handleClose = useModalRouteClose('/app/places')

    return <ReviewWriterPanel onClose={handleClose} place={place} />
}
