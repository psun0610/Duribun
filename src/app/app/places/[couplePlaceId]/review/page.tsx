import { redirect } from 'next/navigation'
import { CoupleDisconnectPending } from '@/components/CoupleDisconnectPending'
import { getFallbackReviewDetail } from '@/features/place/components/CouplePlaceApp/utils/couplePlaceApp.utils'
import { parseAppViewMode } from '@/features/place/components/CouplePlaceApp/utils/couplePlaceRoute.utils'

import { getProtectedAppData } from '@/app/app/getProtectedAppData'
import { PlacesRouteBackground } from '@/app/app/places/PlacesRouteBackground'
import { ReviewDetailRoutePanel } from '@/app/app/places/_components/ReviewDetailRoutePanel'

interface ReviewDetailPageProps {
    params: Promise<{
        couplePlaceId: string
    }>
    searchParams?: Promise<{
        disconnectError?: string
        view?: string
    }>
}

const ReviewDetailPage = async ({
    params,
    searchParams,
}: ReviewDetailPageProps) => {
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
    const place = {
        category: targetPlace.category,
        couplePlaceId: targetPlace.couplePlaceId,
        isPublic: targetPlace.isPublic,
        name: targetPlace.name,
    }
    const detail = appState.data.reviewDetailsByPlaceId[targetPlace.couplePlaceId]
        ?? getFallbackReviewDetail(place)

    return (
        <>
            <PlacesRouteBackground appData={appState.data} viewMode={viewMode} />
            <ReviewDetailRoutePanel
                currentUserId={appState.data.currentUserId}
                detail={detail}
                place={place}
            />
        </>
    )
}

export default ReviewDetailPage
