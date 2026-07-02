import { redirect } from 'next/navigation'
import { CoupleDisconnectPending } from '@/components/CoupleDisconnectPending'
import { parseAppViewMode } from '@/features/place/components/CouplePlaceApp/utils/couplePlaceRoute.utils'

import { getProtectedAppData } from '@/app/app/getProtectedAppData'
import { PlacesRouteBackground } from '@/app/app/places/PlacesRouteBackground'
import { ReviewWriterRoutePanel } from '@/app/app/places/_components/ReviewWriterRoutePanel'

interface ReviewWriterPageProps {
    params: Promise<{
        couplePlaceId: string
    }>
    searchParams?: Promise<{
        disconnectError?: string
        view?: string
    }>
}

const ReviewWriterPage = async ({
    params,
    searchParams,
}: ReviewWriterPageProps) => {
    const resolvedParams = await params
    const resolvedSearchParams = await searchParams
    const appState = await getProtectedAppData({
        disconnectError: resolvedSearchParams?.disconnectError,
    })

    if (appState.kind === 'disconnect-pending') {
        return (
            <CoupleDisconnectPending
                coupleName={appState.coupleName}
                deleteAfter={appState.deleteAfter}
                errorMessage={appState.errorMessage}
                requestedAt={appState.requestedAt}
            />
        )
    }

    const targetPlace = appState.data.places.find(
        place => place.couplePlaceId === resolvedParams.couplePlaceId
    )

    if (!targetPlace) {
        redirect('/app/places')
    }

    const viewMode = parseAppViewMode(resolvedSearchParams?.view)
    const reviewTargetPlace = {
        category: targetPlace.category,
        couplePlaceId: targetPlace.couplePlaceId,
        name: targetPlace.name,
    }

    return (
        <>
            <PlacesRouteBackground appData={appState.data} viewMode={viewMode} />
            <ReviewWriterRoutePanel place={reviewTargetPlace} />
        </>
    )
}

export default ReviewWriterPage
