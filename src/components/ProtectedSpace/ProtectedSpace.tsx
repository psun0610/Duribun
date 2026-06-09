import { CouplePlaceApp } from '@/components/CouplePlaceApp'

import type { ProtectedSpaceProps } from './types/protectedSpace.types'

export const ProtectedSpace = ({
    coupleName,
    userLabel,
}: ProtectedSpaceProps) => {
    return <CouplePlaceApp coupleName={coupleName} userLabel={userLabel} />
}
