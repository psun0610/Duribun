import { CouplePlaceApp } from '@/components/CouplePlaceApp'

import type { ProtectedSpaceProps } from './types/protectedSpace.types'

export const ProtectedSpace = ({ userLabel }: ProtectedSpaceProps) => {
    return <CouplePlaceApp userLabel={userLabel} />
}
