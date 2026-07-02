import { CoupleDisconnectPending } from '@/components/CoupleDisconnectPending'
import { CouplePlaceApp } from '@/features/place/components/CouplePlaceApp'
import { FriendRecommendationsPanel } from '@/features/place/components/CouplePlaceApp/components/FriendRecommendationsPanel'

import { getProtectedAppData } from '@/app/app/getProtectedAppData'

const AppFriendsPage = async () => {
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
        <CouplePlaceApp activeTab="friends" viewMode="feed">
            <FriendRecommendationsPanel
                friendCode={appState.data.friendCode}
                friendCouples={appState.data.friendCouples}
                recommendations={appState.data.friendRecommendations}
            />
        </CouplePlaceApp>
    )
}

export default AppFriendsPage
