import { CouplePlaceApp } from '@/components/CouplePlaceApp'

import type { ProtectedSpaceProps } from './types/protectedSpace.types'

export const ProtectedSpace = ({
    coupleName,
    places,
    userLabel,
}: ProtectedSpaceProps) => {
    return (
        <CouplePlaceApp
            coupleName={coupleName}
            places={places}
            userLabel={userLabel}
        />
    )
}
