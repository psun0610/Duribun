import { CouplePlaceApp } from '@/features/place/components/CouplePlaceApp'

import type { ProtectedSpaceProps } from './types/protectedSpace.types'

export const ProtectedSpace = ({
    coupleName,
    currentUserId,
    friendCode,
    friendCouples,
    friendRecommendations,
    places,
    reviewDetailsByPlaceId,
    userLabel,
}: ProtectedSpaceProps) => {
    return (
        <CouplePlaceApp
            coupleName={coupleName}
            currentUserId={currentUserId}
            friendCode={friendCode}
            friendCouples={friendCouples}
            friendRecommendations={friendRecommendations}
            places={places}
            reviewDetailsByPlaceId={reviewDetailsByPlaceId}
            userLabel={userLabel}
        />
    )
}
