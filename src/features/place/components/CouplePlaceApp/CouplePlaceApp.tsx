'use client'

import { Compass, Users } from 'lucide-react'

import { PlaceRegistrationPanel } from '@/features/place/components/PlaceRegistrationPanel'
import { ReviewDetailPanel } from '@/features/review/components/ReviewDetailPanel'
import { ReviewWriterPanel } from '@/features/review/components/ReviewWriterPanel'

import { AppHeader } from './components/AppHeader'
import { BottomNavigation } from './components/BottomNavigation'
import { EmptyTab } from './components/EmptyTab'
import { PlacesTabPanel } from './components/PlacesTabPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { COUPLE_PLACE_APP_COPY } from './const/couplePlaceApp.const'
import { useCouplePlaceApp } from './hooks/useCouplePlaceApp'
import type { CouplePlaceAppProps } from './types/couplePlaceApp.types'
import { getFallbackReviewDetail } from './utils/couplePlaceApp.utils'

import styles from './CouplePlaceApp.module.scss'

export const CouplePlaceApp = ({
    coupleName,
    currentUserId,
    places,
    reviewDetailsByPlaceId,
}: CouplePlaceAppProps) => {
    const {
        activeTab,
        handleCloseRegistrationPanel,
        handleCloseReviewDetail,
        handleCloseReviewWriter,
        handleFeedView,
        handleListView,
        handleOpenRegistrationPanel,
        handleOpenReviewDetail,
        handleTabChange,
        isRegistrationPanelOpen,
        reviewDetailTargetPlace,
        reviewTargetPlace,
        viewMode,
    } = useCouplePlaceApp()
    const reviewDetail =
        reviewDetailTargetPlace &&
        (reviewDetailsByPlaceId[reviewDetailTargetPlace.couplePlaceId] ??
            getFallbackReviewDetail(reviewDetailTargetPlace))

    return (
        <main className={styles.app}>
            <section className={styles.content}>
                <AppHeader
                    coupleName={coupleName}
                    onFeedView={handleFeedView}
                    onListView={handleListView}
                    viewMode={viewMode}
                />

                {activeTab === 'places' && isRegistrationPanelOpen ? (
                    <PlaceRegistrationPanel
                        onClose={handleCloseRegistrationPanel}
                    />
                ) : null}

                {activeTab === 'places' && reviewTargetPlace ? (
                    <ReviewWriterPanel
                        onClose={handleCloseReviewWriter}
                        place={reviewTargetPlace}
                    />
                ) : null}

                {activeTab === 'places' && reviewDetailTargetPlace ? (
                    <ReviewDetailPanel
                        currentUserId={currentUserId}
                        detail={reviewDetail}
                        onClose={handleCloseReviewDetail}
                        place={reviewDetailTargetPlace}
                    />
                ) : null}

                {activeTab === 'places' ? (
                    <PlacesTabPanel
                        onOpenReviewDetail={handleOpenReviewDetail}
                        places={places}
                        reviewDetailsByPlaceId={reviewDetailsByPlaceId}
                        viewMode={viewMode}
                    />
                ) : null}

                {activeTab === 'friends' ? (
                    <EmptyTab
                        description={COUPLE_PLACE_APP_COPY.friendDescription}
                        icon={Users}
                        title={COUPLE_PLACE_APP_COPY.friendTitle}
                    />
                ) : null}

                {activeTab === 'explore' ? (
                    <EmptyTab
                        description={COUPLE_PLACE_APP_COPY.exploreDescription}
                        icon={Compass}
                        title={COUPLE_PLACE_APP_COPY.exploreTitle}
                    />
                ) : null}

                {activeTab === 'settings' ? <SettingsPanel /> : null}
            </section>

            <BottomNavigation
                activeTab={activeTab}
                onAddPlace={handleOpenRegistrationPanel}
                onTabChange={handleTabChange}
            />
        </main>
    )
}
