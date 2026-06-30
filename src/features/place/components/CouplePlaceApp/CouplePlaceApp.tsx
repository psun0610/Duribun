'use client'

import { PlaceRegistrationPanel } from '@/features/place/components/PlaceRegistrationPanel'
import { ReviewDetailPanel } from '@/features/review/components/ReviewDetailPanel'
import { ReviewWriterPanel } from '@/features/review/components/ReviewWriterPanel'

import { AppHeader } from './components/AppHeader'
import { BottomNavigation } from './components/BottomNavigation'
import { ExploreRecommendationsPanel } from './components/ExploreRecommendationsPanel'
import { FriendRecommendationsPanel } from './components/FriendRecommendationsPanel'
import { PlacesTabPanel } from './components/PlacesTabPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { useCouplePlaceApp } from './hooks/useCouplePlaceApp'
import type { CouplePlaceAppProps } from './types/couplePlaceApp.types'
import { getFallbackReviewDetail } from './utils/couplePlaceApp.utils'

import styles from './CouplePlaceApp.module.scss'

export const CouplePlaceApp = ({
    currentUserId,
    exploreRecommendations,
    friendCode,
    friendCouples,
    friendRecommendations,
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
                    activeTab={activeTab}
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
                    <FriendRecommendationsPanel
                        friendCode={friendCode}
                        friendCouples={friendCouples}
                        recommendations={friendRecommendations}
                    />
                ) : null}

                {activeTab === 'explore' ? (
                    <ExploreRecommendationsPanel
                        recommendations={exploreRecommendations}
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
