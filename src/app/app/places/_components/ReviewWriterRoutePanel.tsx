'use client'

import { useRouter } from 'next/navigation'

import { ReviewWriterPanel } from '@/features/review/components/ReviewWriterPanel'
import type { ReviewTargetPlace } from '@/features/review/types/reviewSubmission.types'

interface ReviewWriterRoutePanelProps {
    place: ReviewTargetPlace
}

export const ReviewWriterRoutePanel = ({
    place,
}: ReviewWriterRoutePanelProps) => {
    const router = useRouter()

    return <ReviewWriterPanel onClose={() => router.back()} place={place} />
}
