'use client'

import { PlaceRegistrationPanel } from '@/features/place/components/PlaceRegistrationPanel'

import { useModalRouteClose } from './useModalRouteClose'

export const PlaceRegistrationRoutePanel = () => {
    const handleClose = useModalRouteClose('/app/places')

    return <PlaceRegistrationPanel onClose={handleClose} />
}
