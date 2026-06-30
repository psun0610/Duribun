import { MOCK_PLACES } from '../const/couplePlaceApp.const'
import type { PlacesTabPanelProps } from '../types/couplePlaceAppComponent.types'
import { PlaceCardFeed, PlaceCardList } from './MockPlaceCards'
import {
    RegisteredPlaceFeedCard,
    RegisteredPlaceListCard,
} from './RegisteredPlaceCards'

import styles from '../CouplePlaceApp.module.scss'

export const PlacesTabPanel = ({
    onOpenReviewDetail,
    onOpenReviewWriter,
    places,
    reviewDetailsByPlaceId,
    viewMode,
}: PlacesTabPanelProps) => {
    if (places.length === 0) {
        return (
            <div
                className={
                    viewMode === 'feed'
                        ? styles.mockFeedGrid
                        : styles.mockList
                }
            >
                {MOCK_PLACES.map(place =>
                    viewMode === 'feed' ? (
                        <PlaceCardFeed key={place.id} place={place} />
                    ) : (
                        <PlaceCardList key={place.id} place={place} />
                    )
                )}
            </div>
        )
    }

    return (
        <div
            className={
                viewMode === 'feed'
                    ? styles.registeredFeedGrid
                    : styles.registeredList
            }
        >
            {places.map(place =>
                viewMode === 'feed' ? (
                    <RegisteredPlaceFeedCard
                        detail={reviewDetailsByPlaceId[place.couplePlaceId]}
                        key={place.couplePlaceId}
                        onOpenReviewDetail={onOpenReviewDetail}
                        onOpenReviewWriter={onOpenReviewWriter}
                        place={place}
                    />
                ) : (
                    <RegisteredPlaceListCard
                        detail={reviewDetailsByPlaceId[place.couplePlaceId]}
                        key={place.couplePlaceId}
                        onOpenReviewDetail={onOpenReviewDetail}
                        onOpenReviewWriter={onOpenReviewWriter}
                        place={place}
                    />
                )
            )}
        </div>
    )
}
