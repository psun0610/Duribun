import { CouplePlaceApp } from '@/components/CouplePlaceApp'

import type { ProtectedSpaceProps } from './types/protectedSpace.types'

export const ProtectedSpace = ({
    coupleName,
    currentUserId,
    places,
    reviewDetailsByPlaceId,
    userLabel,
}: ProtectedSpaceProps) => {
    return (
        <CouplePlaceApp
            coupleName={coupleName}
            currentUserId={currentUserId}
            places={places}
            reviewDetailsByPlaceId={reviewDetailsByPlaceId}
            userLabel={userLabel}
        />
    )
}
