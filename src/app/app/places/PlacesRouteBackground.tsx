import { CouplePlaceApp } from '@/features/place/components/CouplePlaceApp'
import { PlacesTabPanel } from '@/features/place/components/CouplePlaceApp/components/PlacesTabPanel'
import {
    getAppReviewDetailHref,
    getAppReviewWriterHref,
} from '@/features/place/components/CouplePlaceApp/utils/couplePlaceRoute.utils'

import type { ReadyProtectedAppData } from '../getProtectedAppData'

interface PlacesRouteBackgroundProps {
    appData: ReadyProtectedAppData
    viewMode: 'feed' | 'list'
}

export const PlacesRouteBackground = ({
    appData,
    viewMode,
}: PlacesRouteBackgroundProps) => {
    return (
        <CouplePlaceApp activeTab="places" viewMode={viewMode}>
            <PlacesTabPanel
                onOpenReviewDetail={place =>
                    getAppReviewDetailHref(place.couplePlaceId, viewMode)
                }
                onOpenReviewWriter={place =>
                    getAppReviewWriterHref(place.couplePlaceId, viewMode)
                }
                places={appData.places}
                reviewDetailsByPlaceId={appData.reviewDetailsByPlaceId}
                viewMode={viewMode}
            />
        </CouplePlaceApp>
    )
}
