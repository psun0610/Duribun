import { Ellipsis, Globe, Lock, MapPin, Star } from 'lucide-react'

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
    getReviewTargetPlace,
} from '../utils/couplePlaceApp.utils'

import styles from '../CouplePlaceApp.module.scss'

const getRegisteredPlacePhotoUrl = (
    detail: RegisteredPlaceCardProps['detail']
) => {
    return (
        detail?.reviews
            .flatMap(review => review.photos)
            .find(photo => photo.kind === 'place_food')?.signedUrl ??
        detail?.reviews.flatMap(review => review.photos)[0]?.signedUrl ??
        null
    )
}

export const RegisteredPlaceFeedCard = ({
    detail,
    onOpenReviewDetail,
    onOpenReviewWriter,
    place,
}: RegisteredPlaceCardProps) => {
    const status = getRegisteredPlaceStatus(detail)
    const rating = getRegisteredPlaceRating(detail)
    const photoUrl = getRegisteredPlacePhotoUrl(detail)
    const shouldOpenReviewWriter =
        status === 'none' || status === 'partner-waiting'

    return (
        <button
            className={styles.registeredFeedCard}
            onClick={() =>
                shouldOpenReviewWriter
                    ? onOpenReviewWriter(getReviewTargetPlace(place))
                    : onOpenReviewDetail(getReviewDetailTargetPlace(place))
            }
            type="button"
        >
            <span className={styles.registeredFeedVisual}>
                {photoUrl ? (
                    <span
                        aria-label={place.name}
                        className={styles.feedPhoto}
                        role="img"
                        style={{ backgroundImage: `url(${photoUrl})` }}
                    />
                ) : (
                    <MapPin aria-hidden="true" />
                )}
                <span className={styles.registeredPrivacyIcon}>
                    <Ellipsis aria-hidden="true" size={13} />
                </span>
            </span>
            <span className={styles.registeredFeedBody}>
                <strong>{place.name}</strong>
                <span className={styles.registeredMeta}>
                    {CATEGORY_LABEL[place.category]}
                </span>
                <span className={styles.cardStatusRows}>
                    <Badge
                        size="sm"
                        variant={getReviewStatusBadgeVariant(status)}
                    >
                        {REVIEW_STATUS_LABEL[status]}
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
                    <Pill
                        icon={<Star aria-hidden="true" size={12} />}
                        tone="rating"
                    >
                        {rating ?? '-'}
                    </Pill>
                </span>
            </span>
        </button>
    )
}

export const RegisteredPlaceListCard = ({
    detail,
    onOpenReviewDetail,
    onOpenReviewWriter,
    place,
}: RegisteredPlaceCardProps) => {
    const status = getRegisteredPlaceStatus(detail)
    const rating = getRegisteredPlaceRating(detail)
    const photoUrl = getRegisteredPlacePhotoUrl(detail)
    const shouldOpenReviewWriter =
        status === 'none' || status === 'partner-waiting'

    return (
        <button
            className={styles.registeredListCard}
            onClick={() =>
                shouldOpenReviewWriter
                    ? onOpenReviewWriter(getReviewTargetPlace(place))
                    : onOpenReviewDetail(getReviewDetailTargetPlace(place))
            }
            type="button"
        >
            <span className={styles.registeredListVisual}>
                {photoUrl ? (
                    <span
                        aria-label={place.name}
                        className={styles.feedPhoto}
                        role="img"
                        style={{ backgroundImage: `url(${photoUrl})` }}
                    />
                ) : (
                    <MapPin aria-hidden="true" />
                )}
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
                <Pill
                    className={styles.registeredListRating}
                    icon={<Star aria-hidden="true" size={12} />}
                    tone="rating"
                >
                    {rating ?? '-'}
                </Pill>
                <Badge
                    size="sm"
                    variant={getReviewStatusBadgeVariant(status)}
                >
                    {REVIEW_STATUS_LABEL[status]}
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
            </span>
        </button>
    )
}
