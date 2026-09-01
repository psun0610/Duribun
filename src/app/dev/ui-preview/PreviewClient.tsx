'use client'

import { CouplePlaceApp } from '@/features/place/components/CouplePlaceApp'
import { PlacesEmptyState } from '@/features/place/components/CouplePlaceApp/components/PlacesEmptyState'
import { PlacesTabPanel } from '@/features/place/components/CouplePlaceApp/components/PlacesTabPanel'
import { PlaceRegistrationPanel } from '@/features/place/components/PlaceRegistrationPanel'
import { ReviewDetailPanel } from '@/features/review/components/ReviewDetailPanel'
import { ReviewWriterPanel } from '@/features/review/components/ReviewWriterPanel'

import {
    CURRENT_USER_ID,
    PREVIEW_PLACES,
    PREVIEW_REVIEW_DETAIL,
    PREVIEW_REVIEW_DETAILS_BY_PLACE_ID,
} from './fixtures'

const noop = () => {}
const href = () => '#'

export const PreviewClient = ({ screen }: { screen: string }) => {
    if (screen === 'places-empty') {
        return (
            <CouplePlaceApp
                activeTab="places"
                myName="봄이좋아"
                partnerName="하늘이"
                placeCount={0}
                viewMode="feed"
            >
                <PlacesEmptyState addPlaceHref="#" />
            </CouplePlaceApp>
        )
    }

    if (screen === 'place-new') {
        return <PlaceRegistrationPanel onClose={noop} />
    }

    if (screen === 'review-writer') {
        return (
            <ReviewWriterPanel
                onClose={noop}
                place={{
                    category: 'cafe',
                    couplePlaceId: 'cp-1',
                    name: '오션뷰 브런치 카페',
                }}
            />
        )
    }

    if (screen === 'review-detail') {
        return (
            <ReviewDetailPanel
                currentUserId={CURRENT_USER_ID}
                detail={PREVIEW_REVIEW_DETAIL}
                onClose={noop}
                place={{
                    category: 'cafe',
                    couplePlaceId: 'cp-1',
                    isPublic: false,
                    name: '오션뷰 브런치 카페',
                }}
            />
        )
    }

    const viewMode = screen === 'places-list' ? 'list' : 'feed'

    return (
        <CouplePlaceApp
            activeTab="places"
            myName="봄이좋아"
            partnerName="하늘이"
            placeCount={PREVIEW_PLACES.length}
            viewMode={viewMode}
        >
            <PlacesTabPanel
                addPlaceHref="#"
                onOpenReviewDetail={href}
                onOpenReviewWriter={href}
                places={PREVIEW_PLACES}
                reviewDetailsByPlaceId={PREVIEW_REVIEW_DETAILS_BY_PLACE_ID}
                viewMode={viewMode}
            />
        </CouplePlaceApp>
    )
}
