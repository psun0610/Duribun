import { CoupleDisconnectPending } from '@/components/CoupleDisconnectPending'
import { parseAppViewMode } from '@/features/place/components/CouplePlaceApp/utils/couplePlaceRoute.utils'

import { getProtectedAppData } from '@/app/app/getProtectedAppData'
import { PlacesRouteBackground } from '@/app/app/places/PlacesRouteBackground'

interface AppPlacesPageProps {
    searchParams?: Promise<{
        disconnectError?: string
        view?: string
    }>
}

const AppPlacesPage = async ({ searchParams }: AppPlacesPageProps) => {
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

    return <PlacesRouteBackground appData={appState.data} viewMode={viewMode} />
}

export default AppPlacesPage
