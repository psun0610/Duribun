import { Globe, Lock, MapPin, Star } from 'lucide-react'

import { Badge, Pill } from '@/components/ui'

import {
    CATEGORY_LABEL,
    COUPLE_PLACE_APP_COPY,
    REVIEW_STATUS_LABEL,
} from '../const/couplePlaceApp.const'
import type { RegisteredPlaceCardProps } from '../types/couplePlaceAppComponent.types'
import {
    getRegisteredPlaceRating,
    getRegisteredPlaceStatus,
    getReviewStatusBadgeVariant,
    getReviewDetailTargetPlace,
} from '../utils/couplePlaceApp.utils'

import styles from '../CouplePlaceApp.module.scss'

export const RegisteredPlaceFeedCard = ({
    detail,
    onOpenReviewDetail,
    place,
}: RegisteredPlaceCardProps) => {
    const status = getRegisteredPlaceStatus(detail)
    const rating = getRegisteredPlaceRating(detail)

    return (
        <button
            className={styles.registeredFeedCard}
            onClick={() => onOpenReviewDetail(getReviewDetailTargetPlace(place))}
            type="button"
        >
            <span className={styles.registeredFeedVisual}>
                <MapPin aria-hidden="true" />
                <span className={styles.registeredPrivacyIcon}>
                    {place.isPublic ? (
                        <Globe
                            aria-label={COUPLE_PLACE_APP_COPY.public}
                            size={13}
                        />
                    ) : (
                        <Lock
                            aria-label={COUPLE_PLACE_APP_COPY.private}
                            size={13}
                        />
                    )}
                </span>
                {rating ? (
                    <Pill
                        className={styles.registeredRating}
                        icon={<Star aria-hidden="true" size={12} />}
                        tone="rating"
                    >
                        {rating}
                    </Pill>
                ) : null}
            </span>
            <span className={styles.registeredFeedBody}>
                <strong>{place.name}</strong>
                <Badge
                    size="sm"
                    variant={getReviewStatusBadgeVariant(status)}
                >
                    {REVIEW_STATUS_LABEL[status]}
                </Badge>
            </span>
        </button>
    )
}

export const RegisteredPlaceListCard = ({
    detail,
    onOpenReviewDetail,
    place,
}: RegisteredPlaceCardProps) => {
    const status = getRegisteredPlaceStatus(detail)
    const rating = getRegisteredPlaceRating(detail)

    return (
        <button
            className={styles.registeredListCard}
            onClick={() => onOpenReviewDetail(getReviewDetailTargetPlace(place))}
            type="button"
        >
            <span className={styles.registeredListVisual}>
                <MapPin aria-hidden="true" />
            </span>
            <span className={styles.registeredListBody}>
                <span className={styles.registeredListHeader}>
                    <strong>{place.name}</strong>
                    <span className={styles.registeredPrivacyIconInline}>
                        {place.isPublic ? (
                            <Globe
                                aria-label={COUPLE_PLACE_APP_COPY.public}
                                size={13}
                            />
                        ) : (
                            <Lock
                                aria-label={COUPLE_PLACE_APP_COPY.private}
                                size={13}
                            />
                        )}
                    </span>
                </span>
                <span className={styles.registeredMeta}>
                    {CATEGORY_LABEL[place.category]}
                    {place.roadAddress || place.address
                        ? ` / ${place.roadAddress || place.address}`
                        : ''}
                </span>
                {rating ? (
                    <Pill
                        className={styles.registeredListRating}
                        icon={<Star aria-hidden="true" size={12} />}
                        tone="rating"
                    >
                        {rating}
                    </Pill>
                ) : null}
                <Badge
                    size="sm"
                    variant={getReviewStatusBadgeVariant(status)}
                >
                    {REVIEW_STATUS_LABEL[status]}
                </Badge>
            </span>
        </button>
    )
}
