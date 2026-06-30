import { Ellipsis, Globe, Lock, Star } from 'lucide-react'

import { Badge, Pill } from '@/components/ui'

import {
    CATEGORY_LABEL,
    COUPLE_PLACE_APP_COPY,
    REVIEW_STATUS_LABEL,
} from '../const/couplePlaceApp.const'
import type { MockPlaceCardProps } from '../types/couplePlaceAppComponent.types'
import { getReviewStatusBadgeVariant } from '../utils/couplePlaceApp.utils'

import styles from '../CouplePlaceApp.module.scss'

const PlacePhoto = ({ place }: MockPlaceCardProps) => {
    return (
        <div
            aria-label={place.name}
            className={styles.feedPhoto}
            role="img"
            style={{ backgroundImage: `url(${place.photoUrl})` }}
        />
    )
}

export const PlaceCardFeed = ({ place }: MockPlaceCardProps) => {
    return (
        <article className={styles.mockFeedCard}>
            <div className={styles.mockFeedVisual}>
                <PlacePhoto place={place} />
                <span className={styles.cardMenu}>
                    <Ellipsis aria-hidden="true" size={13} />
                </span>
            </div>
            <div className={styles.mockFeedBody}>
                <h3>{place.name}</h3>
                <div className={styles.cardStatusRows}>
                    <Badge
                        size="sm"
                        variant={getReviewStatusBadgeVariant(place.reviewStatus)}
                    >
                        {REVIEW_STATUS_LABEL[place.reviewStatus]}
                    </Badge>
                    <span className={styles.cardPrivacyText}>
                        {place.isPublic ? (
                            <Globe aria-hidden="true" size={12} />
                        ) : (
                            <Lock aria-hidden="true" size={12} />
                        )}
                        {place.isPublic
                            ? COUPLE_PLACE_APP_COPY.public
                            : COUPLE_PLACE_APP_COPY.private}
                    </span>
                    {place.rating ? (
                        <Pill
                            icon={<Star aria-hidden="true" size={12} />}
                            tone="rating"
                        >
                            {place.rating}
                        </Pill>
                    ) : null}
                </div>
            </div>
        </article>
    )
}

export const PlaceCardList = ({ place }: MockPlaceCardProps) => {
    return (
        <article className={styles.mockListCard}>
            <div className={styles.mockListVisual}>
                <PlacePhoto place={place} />
            </div>
            <div className={styles.mockListBody}>
                <div className={styles.mockListHeader}>
                    <div>
                        <h3>{place.name}</h3>
                        <p>
                            {CATEGORY_LABEL[place.category]}
                            {place.visitDate ? ` · ${place.visitDate}` : ''}
                        </p>
                    </div>
                    <span className={styles.cardPrivacyInline}>
                        {place.isPublic ? (
                            <Globe
                                aria-label={COUPLE_PLACE_APP_COPY.public}
                                size={12}
                            />
                        ) : (
                            <Lock
                                aria-label={COUPLE_PLACE_APP_COPY.private}
                                size={12}
                            />
                        )}
                    </span>
                </div>
                <div className={styles.mockListMeta}>
                    {place.rating ? (
                        <Pill
                            icon={<Star aria-hidden="true" size={12} />}
                            tone="rating"
                        >
                            {place.rating}
                        </Pill>
                    ) : null}
                    <Badge
                        size="sm"
                        variant={getReviewStatusBadgeVariant(place.reviewStatus)}
                    >
                        {REVIEW_STATUS_LABEL[place.reviewStatus]}
                    </Badge>
                    <span className={styles.cardPrivacyText}>
                        {place.isPublic ? (
                            <Globe aria-hidden="true" size={12} />
                        ) : (
                            <Lock aria-hidden="true" size={12} />
                        )}
                        {place.isPublic
                            ? COUPLE_PLACE_APP_COPY.public
                            : COUPLE_PLACE_APP_COPY.private}
                    </span>
                </div>
            </div>
        </article>
    )
}
