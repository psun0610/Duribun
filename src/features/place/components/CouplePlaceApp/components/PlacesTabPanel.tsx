import type { PlacesTabPanelProps } from '../types/couplePlaceAppComponent.types'
import { PlacesEmptyState } from './PlacesEmptyState'
import {
    RegisteredPlaceFeedCard,
    RegisteredPlaceListCard,
} from './RegisteredPlaceCards'

import styles from '../CouplePlaceApp.module.scss'

export const PlacesTabPanel = ({
    addPlaceHref,
    onOpenReviewDetail,
    onOpenReviewWriter,
    places,
    reviewDetailsByPlaceId,
    viewMode,
}: PlacesTabPanelProps) => {
    if (places.length === 0) {
        return <PlacesEmptyState addPlaceHref={addPlaceHref} />
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
