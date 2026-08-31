import { Star } from 'lucide-react'

import { REVIEW_STATUS_BADGE } from '@/features/review/const/reviewStatus.const'

import type { MockPlaceCardProps } from '../types/couplePlaceAppComponent.types'

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

const StatusDot = ({ place }: MockPlaceCardProps) => {
    if (place.reviewStatus === 'complete') {
        return null
    }

    return (
        <span
            aria-label={REVIEW_STATUS_BADGE[place.reviewStatus]}
            className={`${styles.statusDot} ${
                styles[`statusDot_${place.reviewStatus}`]
            }`}
            role="img"
        />
    )
}

const PlaceInfo = ({ place, starSize }: MockPlaceCardProps & { starSize: number }) => {
    return (
        <>
            <div className={styles.cardTitleRow}>
                <strong>{place.name}</strong>
                {place.rating ? (
                    <span className={styles.cardRating}>
                        <Star aria-hidden="true" size={starSize} />
                        {place.rating}
                    </span>
                ) : null}
            </div>
            {place.tags && place.tags.length > 0 ? (
                <div className={styles.cardTagRow}>
                    {place.tags.slice(0, 2).map(tag => (
                        <span className={styles.cardTag} key={tag}>
                            {tag}
                        </span>
                    ))}
                </div>
            ) : null}
        </>
    )
}

export const PlaceCardFeed = ({ place }: MockPlaceCardProps) => {
    return (
        <article className={styles.mockFeedCard}>
            <div className={styles.mockFeedVisual}>
                <PlacePhoto place={place} />
                <StatusDot place={place} />
            </div>
            <div className={styles.mockFeedBody}>
                <PlaceInfo place={place} starSize={9} />
            </div>
        </article>
    )
}

export const PlaceCardList = ({ place }: MockPlaceCardProps) => {
    return (
        <article className={styles.mockListCard}>
            <div className={styles.mockListVisual}>
                <PlacePhoto place={place} />
                <StatusDot place={place} />
            </div>
            <div className={styles.mockListBody}>
                <PlaceInfo place={place} starSize={10} />
            </div>
        </article>
    )
}
