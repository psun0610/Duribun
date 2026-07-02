'use client'

import { useRouter } from 'next/navigation'

import { PlaceRegistrationPanel } from '@/features/place/components/PlaceRegistrationPanel'

export const PlaceRegistrationRoutePanel = () => {
    const router = useRouter()

    return <PlaceRegistrationPanel onClose={() => router.back()} />
}
