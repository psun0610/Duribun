import { CoupleDisconnectPending } from '@/components/CoupleDisconnectPending'
import { parseAppViewMode } from '@/features/place/components/CouplePlaceApp/utils/couplePlaceRoute.utils'

import { getProtectedAppData } from '@/app/app/getProtectedAppData'
import { PlacesRouteBackground } from '@/app/app/places/PlacesRouteBackground'
import { PlaceRegistrationRoutePanel } from '@/app/app/places/_components/PlaceRegistrationRoutePanel'

interface PlaceRegistrationPageProps {
    searchParams?: Promise<{
        disconnectError?: string
        view?: string
    }>
}

const PlaceRegistrationPage = async ({
    searchParams,
}: PlaceRegistrationPageProps) => {
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

    const viewMode = parseAppViewMode(resolvedSearchParams?.view)

    return (
        <>
            <PlacesRouteBackground appData={appState.data} viewMode={viewMode} />
            <PlaceRegistrationRoutePanel />
        </>
    )
}

export default PlaceRegistrationPage
