import { CoupleDisconnectPending } from '@/components/CoupleDisconnectPending'
import { CouplePlaceApp } from '@/features/place/components/CouplePlaceApp'
import { ExploreRecommendationsPanel } from '@/features/place/components/CouplePlaceApp/components/ExploreRecommendationsPanel'

import { getProtectedAppData } from '@/app/app/getProtectedAppData'

const AppExplorePage = async () => {
    const appState = await getProtectedAppData()

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

    return (
        <CouplePlaceApp activeTab="explore" viewMode="feed">
            <ExploreRecommendationsPanel
                recommendations={appState.data.exploreRecommendations}
            />
        </CouplePlaceApp>
    )
}

export default AppExplorePage
