import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'

import { REVIEW_STATUS_BADGE } from '@/features/review/const/reviewStatus.const'

import type { RegisteredPlaceCardProps } from '../types/couplePlaceAppComponent.types'
import {
    getRegisteredPlaceRating,
    getRegisteredPlaceStatus,
    getRegisteredPlaceTags,
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

/**
 * 리뷰 상태는 사진 위 색점 하나로만 알립니다.
 * 둘 다 썼으면 알릴 것이 없으므로 점을 두지 않습니다.
 */
const StatusDot = ({
    status,
}: {
    status: ReturnType<typeof getRegisteredPlaceStatus>
}) => {
    if (status === 'complete') {
        return null
    }

    return (
        <span
            aria-label={REVIEW_STATUS_BADGE[status]}
            className={`${styles.statusDot} ${styles[`statusDot_${status}`]}`}
            role="img"
        />
    )
}

// 태그가 없어도 자리를 비워 둡니다. 그래야 격자 줄이 어긋나지 않습니다.
const PlaceTags = ({ tags }: { tags: string[] }) => {
    return (
        <span className={styles.cardTagRow}>
            {tags.map(tag => (
                <span className={styles.cardTag} key={tag}>
                    {tag}
                </span>
            ))}
        </span>
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
    const tags = getRegisteredPlaceTags(detail)
    const photoUrl = getRegisteredPlacePhotoUrl(detail)
    const shouldOpenReviewWriter =
        status === 'none' || status === 'partner-waiting'
    const href = shouldOpenReviewWriter
        ? onOpenReviewWriter(getReviewTargetPlace(place))
        : onOpenReviewDetail(getReviewDetailTargetPlace(place))

    return (
        <Link className={styles.registeredFeedCard} href={href}>
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
                <StatusDot status={status} />
            </span>
            <span className={styles.registeredFeedBody}>
                <span className={styles.cardTitleRow}>
                    <strong>{place.name}</strong>
                    {rating ? (
                        <span className={styles.cardRating}>
                            <Star aria-hidden="true" size={9} />
                            {rating}
                        </span>
                    ) : null}
                </span>
                <PlaceTags tags={tags} />
            </span>
        </Link>
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
    const tags = getRegisteredPlaceTags(detail)
    const photoUrl = getRegisteredPlacePhotoUrl(detail)
    const shouldOpenReviewWriter =
        status === 'none' || status === 'partner-waiting'
    const href = shouldOpenReviewWriter
        ? onOpenReviewWriter(getReviewTargetPlace(place))
        : onOpenReviewDetail(getReviewDetailTargetPlace(place))

    return (
        <Link className={styles.registeredListCard} href={href}>
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
                <StatusDot status={status} />
            </span>
            <span className={styles.registeredListBody}>
                <span className={styles.cardTitleRow}>
                    <strong>{place.name}</strong>
                    {rating ? (
                        <span className={styles.cardRating}>
                            <Star aria-hidden="true" size={10} />
                            {rating}
                        </span>
                    ) : null}
                </span>
                <PlaceTags tags={tags} />
            </span>
        </Link>
    )
}
