import { CoupleDisconnectPending } from '@/components/CoupleDisconnectPending'
import { CouplePlaceApp } from '@/features/place/components/CouplePlaceApp'
import { SettingsPanel } from '@/features/place/components/CouplePlaceApp/components/SettingsPanel'

import { getProtectedAppData } from '@/app/app/getProtectedAppData'

const AppSettingsPage = async () => {
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
        <CouplePlaceApp activeTab="settings" viewMode="feed">
            <SettingsPanel
                coupleName={appState.data.coupleName}
                friendCoupleCount={appState.data.friendCouples.length}
                publicPlaceCount={appState.data.publicPlaceCount}
                userLabel={appState.data.userLabel}
            />
        </CouplePlaceApp>
    )
}

export default AppSettingsPage
